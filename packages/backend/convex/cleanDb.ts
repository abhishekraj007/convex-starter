import { internalMutation } from "./_generated/server";

/**
 * Demo helper: wipes all user/business data from the database.
 *
 * Internal-only — callable via CLI (`pnpm clean:db`) or the dashboard,
 * never exposed to clients. appConfig is preserved since it holds
 * operator configuration rather than demo data.
 *
 * Note: component data (better-auth accounts, agent threads) lives in
 * isolated component storage and is not affected.
 */
export const run = internalMutation({
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
