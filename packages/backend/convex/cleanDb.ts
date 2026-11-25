import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { components } from "./_generated/api";
import { pushNotifications } from "./pushNotifications";

/**
 * Demo helper: wipes all user/business data from the database.
 *
 * Internal-only — callable via CLI (`pnpm clean:db`) or the dashboard,
 * never exposed to clients. appConfig and the better-auth jwks table
 * (JWT signing keys) are preserved since they hold operational
 * configuration rather than user data.
 *
 * Orchestrated as an action because component data lives in isolated
 * storage and can only be deleted through each component's own API:
 * - better-auth: paginated adapter.deleteMany per model
 * - push notifications: per-user token/notification removal, keyed by
 *   auth user id, so users are enumerated before being wiped
 * - agent: per-user deletion, enumerating userIds from the threads
 *   table (which shrinks as deletion proceeds)
 */
export const run = internalAction({
  args: {},
  handler: async (ctx): Promise<Record<string, number>> => {
    const userIds: string[] = [];
    let usersCursor: string | null = null;
    for (;;) {
      const result: {
        page: Array<{ _id: string }>;
        isDone: boolean;
        continueCursor: string | null;
      } = await ctx.runQuery(components.betterAuth.adapter.findMany, {
        model: "user",
        paginationOpts: { numItems: 100, cursor: usersCursor },
      });
      for (const doc of result.page) {
        userIds.push(doc._id);
      }
      if (result.isDone) break;
      usersCursor = result.continueCursor;
    }

    const deleted: Record<string, number> = await ctx.runMutation(
      internal.cleanDb.wipeAppTables,
    );

    for (const userId of userIds) {
      await pushNotifications.removeToken(ctx, { userId });
      await pushNotifications.deleteNotificationsForUser(ctx, { userId });
    }
    deleted["push:users"] = userIds.length;

    const inputs = [
      { model: "user" },
      { model: "session" },
      { model: "account" },
      { model: "verification" },
      { model: "twoFactor" },
      { model: "rateLimit" },
    ] as const;

    for (const input of inputs) {
      let total = 0;
      for (;;) {
        const result = await ctx.runMutation(
          components.betterAuth.adapter.deleteMany,
          {
            input,
            paginationOpts: { numItems: 100, cursor: null },
          },
        );
        total += result.count;
        if (result.count === 0) break;
      }
      deleted[`auth:${input.model}`] = total;
    }

    let agentUsers = 0;
    for (;;) {
      const result = await ctx.runQuery(
        components.agent.users.listUsersWithThreads,
        { paginationOpts: { numItems: 100, cursor: null } },
      );
      if (result.page.length === 0) break;
      for (const userId of result.page) {
        await ctx.runAction(components.agent.users.deleteAllForUserId, {
          userId,
        });
        agentUsers++;
      }
    }
    deleted["agent:usersWithThreads"] = agentUsers;

    return deleted;
  },
});

export const wipeAppTables = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "profile",
      "subscriptions",
      "subscriptionCreditGrants",
      "orders",
      "uploads",
    ] as const;

    const deleted: Record<string, number> = {};
    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
      deleted[table] = docs.length;
    }
    return deleted;
  },
});
