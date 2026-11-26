import { v } from "convex/values";
import { action, internalQuery, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { requireAdmin } from "./features/appConfig/guards";
import {
  getEmailConfig,
  sendCloudflareEmail,
} from "./lib/email/sendEmail";
import { buildAdminEmail } from "./lib/email/templates";

/**
 * Admin-initiated emails, sent through the same Cloudflare Email Sending
 * pipeline as auth emails. Recipients are restricted to registered users so
 * the tool can never act as an open relay. Sends run in actions because
 * mutations cannot make network requests; admin verification happens in
 * internal queries, which inherit the caller's auth context.
 */

const MAX_BULK_RECIPIENTS = 500;

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Lookup used by the admin UI to preview the single-send recipient.
export const adminLookupEmailUser = query({
  args: {
    email: v.string(),
  },
  returns: v.union(
    v.object({
      authUserId: v.string(),
      email: v.string(),
      name: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const profile = await ctx.db
      .query("profile")
      .withIndex("by_email", (q) => q.eq("email", normalizeEmail(args.email)))
      .first();

    if (!profile) {
      return null;
    }

    return {
      authUserId: profile.authUserId,
      email: profile.email,
      name: profile.name,
    };
  },
});

// Audience stats + whether Cloudflare email is configured, for the admin UI.
export const adminGetEmailAudienceStats = query({
  args: {},
  returns: v.object({
    totalUsers: v.number(),
    configured: v.boolean(),
  }),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const profiles = await ctx.db.query("profile").collect();
    const uniqueEmails = new Set(profiles.map((profile) => profile.email));

    return {
      totalUsers: uniqueEmails.size,
      configured: getEmailConfig() !== null,
    };
  },
});

// Internal: resolve the recipient profile for a single send. Re-verifies
// admin access because actions cannot check auth without a query context.
export const resolveRecipient = internalQuery({
  args: {
    email: v.string(),
  },
  returns: v.union(
    v.object({
      email: v.string(),
      name: v.optional(v.string()),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const profile = await ctx.db
      .query("profile")
      .withIndex("by_email", (q) => q.eq("email", normalizeEmail(args.email)))
      .first();

    if (!profile) {
      return null;
    }

    return { email: profile.email, name: profile.name };
  },
});

// Internal: deduplicated recipient list for bulk sends.
export const listBulkRecipients = internalQuery({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const profiles = await ctx.db.query("profile").collect();
    const emails = new Set<string>();
    for (const profile of profiles) {
      const email = normalizeEmail(profile.email);
      if (email.length > 0) {
        emails.add(email);
      }
    }
    return Array.from(emails).slice(0, MAX_BULK_RECIPIENTS);
  },
});

export const adminSendEmail = action({
  args: {
    email: v.string(),
    subject: v.string(),
    body: v.string(),
  },
  returns: v.object({
    sent: v.boolean(),
    reason: v.optional(v.string()),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{ sent: boolean; reason?: string }> => {
    const recipient = await ctx.runQuery(internal.adminEmails.resolveRecipient, {
      email: args.email,
    });

    if (!recipient) {
      return { sent: false, reason: "no-such-user" };
    }

    const config = getEmailConfig();
    if (!config) {
      return { sent: false, reason: "not-configured" };
    }

    const content = buildAdminEmail({
      subject: args.subject,
      body: args.body,
      appName: config.appName,
    });

    const result = await sendCloudflareEmail({
      to: recipient.email,
      content,
    });

    return result.sent
      ? { sent: true }
      : { sent: false, reason: result.reason };
  },
});

export const adminSendBulkEmail = action({
  args: {
    subject: v.string(),
    body: v.string(),
  },
  returns: v.object({
    totalUsers: v.number(),
    sent: v.number(),
    failed: v.number(),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{ totalUsers: number; sent: number; failed: number }> => {
    const recipients = await ctx.runQuery(
      internal.adminEmails.listBulkRecipients,
      {},
    );

    const config = getEmailConfig();
    if (!config) {
      return { totalUsers: recipients.length, sent: 0, failed: 0 };
    }

    const content = buildAdminEmail({
      subject: args.subject,
      body: args.body,
      appName: config.appName,
    });

    let sent = 0;
    let failed = 0;
    for (const email of recipients) {
      const result = await sendCloudflareEmail({ to: email, content });
      if (result.sent) {
        sent++;
      } else {
        failed++;
      }
    }

    return { totalUsers: recipients.length, sent, failed };
  },
});
