import { v } from "convex/values";
import { action } from "../../_generated/server";
import { internal } from "../../_generated/api";
import type { Doc, Id } from "../../_generated/dataModel";
import { assertPolarWebhookSecret } from "../../lib/polarWebhookAuth";
import {
  orderDocValidator,
  orderStatusValidator,
  subscriptionDocValidator,
  subscriptionPlatformValidator,
  subscriptionStatusValidator,
} from "../../lib/subscriptionValidators";

/**
 * Server-side actions for webhook handlers
 * These can be called from Next.js API routes using fetchAction
 * They internally call secure internal mutations
 */

/**
 * Action to create or update subscription from webhooks
 * Called from Next.js Polar webhook handler
 */
export const upsertSubscriptionFromWebhook = action({
  args: {
    webhookSecret: v.string(),
    userId: v.string(),
    platform: subscriptionPlatformValidator,
    platformCustomerId: v.string(),
    platformSubscriptionId: v.string(),
    platformProductId: v.string(),
    customerEmail: v.string(),
    customerName: v.optional(v.string()),
    status: subscriptionStatusValidator,
    productType: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
  },
  returns: v.object({
    subscriptionId: v.id("subscriptions"),
    isNew: v.boolean(),
    isRenewal: v.boolean(),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{
    subscriptionId: Id<"subscriptions">;
    isNew: boolean;
    isRenewal: boolean;
  }> => {
    assertPolarWebhookSecret(args.webhookSecret);
    const { webhookSecret: _webhookSecret, ...mutationArgs } = args;
    const result: {
      subscriptionId: Id<"subscriptions">;
      isNew: boolean;
      isRenewal: boolean;
    } = await ctx.runMutation(
      internal.features.subscriptions.mutations.upsertSubscription,
      mutationArgs,
    );
    return result;
  },
});

/**
 * Action to sync premium status from webhooks
 */
export const syncPremiumFromWebhook = action({
  args: {
    webhookSecret: v.string(),
    userId: v.string(),
    hasActiveSubscription: v.boolean(),
  },
  returns: v.object({
    success: v.boolean(),
  }),
  handler: async (ctx, args): Promise<{ success: boolean }> => {
    assertPolarWebhookSecret(args.webhookSecret);
    const result: { success: boolean } = await ctx.runMutation(
      internal.features.premium.mutations.syncPremiumFromSubscription,
      {
        userId: args.userId,
        hasActiveSubscription: args.hasActiveSubscription,
      },
    );
    return result;
  },
});

/**
 * Action to add bonus credits from webhooks
 */
export const addBonusCreditsFromWebhook = action({
  args: {
    webhookSecret: v.string(),
    userId: v.string(),
    bonusCredits: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    newCredits: v.number(),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{ success: boolean; newCredits: number }> => {
    assertPolarWebhookSecret(args.webhookSecret);
    const result: { success: boolean; newCredits: number } =
      await ctx.runMutation(
        internal.features.credits.mutations.addBonusCredits,
        {
          userId: args.userId,
          bonusCredits: args.bonusCredits,
        },
      );
    return result;
  },
});

/**
 * Action to add purchased credits from webhooks
 */
export const addCreditsFromWebhook = action({
  args: {
    webhookSecret: v.string(),
    userId: v.string(),
    amount: v.number(),
  },
  returns: v.object({
    success: v.boolean(),
    newCredits: v.number(),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{ success: boolean; newCredits: number }> => {
    assertPolarWebhookSecret(args.webhookSecret);
    const result: { success: boolean; newCredits: number } =
      await ctx.runMutation(
        internal.features.credits.mutations.addCreditsToUser,
        {
          userId: args.userId,
          amount: args.amount,
        },
      );
    return result;
  },
});

/**
 * Action to insert order from webhooks
 */
export const insertOrderFromWebhook = action({
  args: {
    webhookSecret: v.string(),
    userId: v.string(),
    platform: subscriptionPlatformValidator,
    platformOrderId: v.string(),
    platformProductId: v.string(),
    amount: v.number(),
    status: orderStatusValidator,
  },
  returns: v.id("orders"),
  handler: async (ctx, args): Promise<Id<"orders">> => {
    assertPolarWebhookSecret(args.webhookSecret);
    const { webhookSecret: _webhookSecret, ...mutationArgs } = args;
    const result: Id<"orders"> = await ctx.runMutation(
      internal.features.subscriptions.mutations.insertOrder,
      mutationArgs,
    );
    return result;
  },
});

/**
 * Action to check if subscription exists (for idempotency)
 */
export const getSubscriptionByPlatformId = action({
  args: {
    webhookSecret: v.string(),
    platformSubscriptionId: v.string(),
  },
  returns: v.union(subscriptionDocValidator, v.null()),
  handler: async (ctx, args): Promise<Doc<"subscriptions"> | null> => {
    assertPolarWebhookSecret(args.webhookSecret);
    const result: Doc<"subscriptions"> | null = await ctx.runQuery(
      internal.features.subscriptions.queries
        .getSubscriptionByPlatformSubscriptionId,
      { platformSubscriptionId: args.platformSubscriptionId },
    );
    return result;
  },
});

/**
 * Action to check if order exists (for idempotency)
 */
export const getOrderByPlatformId = action({
  args: {
    webhookSecret: v.string(),
    platformOrderId: v.string(),
  },
  returns: v.union(orderDocValidator, v.null()),
  handler: async (ctx, args): Promise<Doc<"orders"> | null> => {
    assertPolarWebhookSecret(args.webhookSecret);
    const result: Doc<"orders"> | null = await ctx.runQuery(
      internal.features.subscriptions.queries.getOrderByPlatformOrderId,
      { platformOrderId: args.platformOrderId },
    );
    return result;
  },
});
