import { v } from "convex/values";

export const subscriptionPlatformValidator = v.union(
  v.literal("polar"),
  v.literal("dodo"),
  v.literal("revenuecat"),
);

export const subscriptionStatusValidator = v.union(
  v.literal("active"),
  v.literal("canceled"),
  v.literal("expired"),
  v.literal("past_due"),
  v.literal("trialing"),
);

export const orderStatusValidator = v.union(
  v.literal("paid"),
  v.literal("pending"),
  v.literal("failed"),
  v.literal("refunded"),
);

export const webPaymentProviderValidator = v.union(
  v.literal("polar"),
  v.literal("dodo"),
);

export const catalogPriceValidator = v.object({
  priceAmount: v.number(),
  priceCurrency: v.string(),
  recurringInterval: v.optional(v.string()),
});

export const catalogProductValidator = v.object({
  id: v.string(),
  name: v.string(),
  description: v.optional(v.string()),
  prices: v.array(catalogPriceValidator),
  metadata: v.optional(
    v.object({
      credits: v.optional(v.string()),
    }),
  ),
});

export const subscriptionDocValidator = v.object({
  _id: v.id("subscriptions"),
  _creationTime: v.number(),
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
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const orderDocValidator = v.object({
  _id: v.id("orders"),
  _creationTime: v.number(),
  userId: v.string(),
  platform: subscriptionPlatformValidator,
  platformOrderId: v.string(),
  platformProductId: v.string(),
  amount: v.number(),
  status: orderStatusValidator,
  createdAt: v.number(),
});
