import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { authComponent } from "./lib/betterAuth";
import { sendAuthOtpEmail, sendPasswordResetEmail } from "./lib/email/sendEmail";

export { createAuth } from "./lib/betterAuth/createAuth";

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();

const authEmailType = v.union(
  v.literal("sign-in"),
  v.literal("email-verification"),
  v.literal("forget-password"),
);

/**
 * Runs in a durable Convex action so the Better Auth HTTP request can return
 * immediately. The email helper is intentionally non-throwing: a missing
 * Cloudflare configuration logs a warning and the auth request still succeeds.
 */
export const deliverAuthOtpEmail = internalAction({
  args: {
    to: v.string(),
    otp: v.string(),
    type: authEmailType,
  },
  handler: async (_ctx, args) => {
    await sendAuthOtpEmail(args);
  },
});

export const deliverPasswordResetEmail = internalAction({
  args: {
    to: v.string(),
    resetUrl: v.string(),
  },
  handler: async (_ctx, args) => {
    await sendPasswordResetEmail(args);
  },
});
