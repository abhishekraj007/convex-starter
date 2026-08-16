import { v } from "convex/values";
import { query, internalQuery } from "../../_generated/server";
import * as Users from "../../model/user";
import { isWebPaymentPlatform } from "../../lib/paymentProvider";
import {
  orderDocValidator,
  subscriptionDocValidator,
  subscriptionPlatformValidator,
} from "../../lib/subscriptionValidators";

export const getUserSubscriptions = query({
  args: {},
  returns: v.union(
    v.object({
      subscriptions: v.array(subscriptionDocValidator),
      hasActiveSubscription: v.boolean(),
      platforms: v.array(subscriptionPlatformValidator),
      hasWebSubscription: v.boolean(),
      hasNativeSubscription: v.boolean(),
    }),
    v.null(),
  ),
  handler: async (ctx) => {
    const userData = await Users.getUserAndProfile(ctx);
    if (!userData) {
      return null;
    }

    const subscriptions = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userData.userMetadata._id))
      .collect();

    return {
      subscriptions,
      hasActiveSubscription: subscriptions.length > 0,
      platforms: subscriptions.map((s) => s.platform),
      hasWebSubscription: subscriptions.some((s) =>
        isWebPaymentPlatform(s.platform),
      ),
      hasNativeSubscription: subscriptions.some(
        (s) => s.platform === "revenuecat",
      ),
    };
  },
});

export const canPurchaseSubscription = query({
  args: {
    platform: subscriptionPlatformValidator,
  },
  returns: v.object({
    canPurchase: v.boolean(),
    reason: v.optional(v.string()),
    existingPlatform: v.optional(subscriptionPlatformValidator),
  }),
  handler: async (ctx, _args) => {
    const userData = await Users.getUserAndProfile(ctx);
    if (!userData) {
      return { canPurchase: false, reason: "Not authenticated" };
    }

    const activeSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_status", (q) =>
        q.eq("userId", userData.userMetadata._id).eq("status", "active"),
      )
      .first();

    if (activeSubscription) {
      const existingPlatform = activeSubscription.platform;
      return {
        canPurchase: false,
        reason: `You already have an active subscription on ${
          isWebPaymentPlatform(existingPlatform) ? "web" : "mobile"
        }`,
        existingPlatform,
      };
    }

    return { canPurchase: true };
  },
});

export const getPlatformCustomerId = query({
  args: {
    platform: subscriptionPlatformValidator,
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const userData = await Users.getUserAndProfile(ctx);
    if (!userData) {
      return null;
    }

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_platform", (q) =>
        q
          .eq("userId", userData.userMetadata._id)
          .eq("platform", args.platform),
      )
      .first();

    return subscription?.platformCustomerId || null;
  },
});

export const getSubscriptionByPlatformSubscriptionId = internalQuery({
  args: {
    platformSubscriptionId: v.string(),
  },
  returns: v.union(subscriptionDocValidator, v.null()),
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_platform_subscription_id", (q) =>
        q.eq("platformSubscriptionId", args.platformSubscriptionId),
      )
      .unique();
    return subscription || null;
  },
});

export const getOrderByPlatformOrderId = internalQuery({
  args: {
    platformOrderId: v.string(),
  },
  returns: v.union(orderDocValidator, v.null()),
  handler: async (ctx, args) => {
    const order = await ctx.db
      .query("orders")
      .withIndex("by_platform_order_id", (q) =>
        q.eq("platformOrderId", args.platformOrderId),
      )
      .unique();
    return order || null;
  },
});

export const getDodoCustomerIdForUser = internalQuery({
  args: {
    userId: v.string(),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_platform", (q) =>
        q.eq("userId", args.userId).eq("platform", "dodo"),
      )
      .first();

    return subscription?.platformCustomerId ?? null;
  },
});

export const getUserIdByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  returns: v.union(v.string(), v.null()),
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profile")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    return profile?.authUserId ?? null;
  },
});
