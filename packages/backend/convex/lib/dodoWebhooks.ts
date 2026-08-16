import type { GenericActionCtx, GenericDataModel } from "convex/server";
import { createDodoWebhookHandler } from "@dodopayments/convex";
import type { Payment, Subscription } from "@dodopayments/convex";
import { internal } from "../_generated/api";
import { getDodoProduct } from "./dodoCatalog";
import {
  creditsForSubscriptionCycle,
  mapDodoIntervalToProductType,
  mapDodoSubscriptionStatus,
  parseCreditAmount,
  readMetadataString,
  toEpochMs,
} from "./dodoMapping";

type ActionCtx = GenericActionCtx<GenericDataModel>;

type SubscriptionEventType =
  | "subscription.active"
  | "subscription.renewed"
  | "subscription.updated"
  | "subscription.plan_changed"
  | "subscription.cancelled"
  | "subscription.on_hold"
  | "subscription.failed"
  | "subscription.expired"
  | "subscription.paused";

async function resolveUserId(
  ctx: ActionCtx,
  args: {
    metadataUserId?: string;
    email?: string;
    subscriptionId?: string;
  },
): Promise<string | null> {
  if (args.metadataUserId) {
    return args.metadataUserId;
  }

  if (args.subscriptionId) {
    const existing = await ctx.runQuery(
      internal.features.subscriptions.queries
        .getSubscriptionByPlatformSubscriptionId,
      { platformSubscriptionId: args.subscriptionId },
    );
    if (existing) {
      return existing.userId;
    }
  }

  if (args.email) {
    const userId = await ctx.runQuery(
      internal.features.subscriptions.queries.getUserIdByEmail,
      { email: args.email },
    );
    if (userId) {
      return userId;
    }
  }

  return null;
}

async function processSubscriptionEvent(
  ctx: ActionCtx,
  subscription: Subscription,
  eventType: SubscriptionEventType,
): Promise<void> {
  const userId = await resolveUserId(ctx, {
    metadataUserId: readMetadataString(subscription.metadata, "userId"),
    email: subscription.customer.email,
    subscriptionId: subscription.subscription_id,
  });

  if (!userId) {
    console.error("[DODO WEBHOOK] No userId for subscription", {
      subscriptionId: subscription.subscription_id,
      email: subscription.customer.email,
    });
    return;
  }

  const mappedStatus = mapDodoSubscriptionStatus(
    subscription.status,
    subscription.cancel_at_next_billing_date,
  );
  const productType = mapDodoIntervalToProductType(
    subscription.payment_frequency_interval,
  );

  const result = await ctx.runMutation(
    internal.features.subscriptions.mutations.upsertSubscription,
    {
      userId,
      platform: "dodo",
      platformCustomerId: subscription.customer.customer_id,
      platformSubscriptionId: subscription.subscription_id,
      platformProductId: subscription.product_id,
      customerEmail: subscription.customer.email,
      customerName: subscription.customer.name,
      status: mappedStatus,
      productType,
      currentPeriodStart: toEpochMs(subscription.previous_billing_date),
      currentPeriodEnd: toEpochMs(subscription.next_billing_date),
      canceledAt: toEpochMs(subscription.cancelled_at),
    },
  );

  const hasActiveSubscription =
    mappedStatus === "active" && !subscription.cancel_at_next_billing_date;

  await ctx.runMutation(
    internal.features.premium.mutations.syncPremiumFromSubscription,
    {
      userId,
      hasActiveSubscription,
    },
  );

  const shouldGrantCredits =
    (eventType === "subscription.active" && result.isNew) ||
    (eventType === "subscription.renewed" && result.isRenewal);

  if (shouldGrantCredits) {
    const bonusCredits = creditsForSubscriptionCycle(
      subscription.payment_frequency_interval,
    );
    await ctx.runMutation(internal.features.credits.mutations.addBonusCredits, {
      userId,
      bonusCredits,
    });
  }
}

async function processPaidOrder(
  ctx: ActionCtx,
  payment: Payment,
): Promise<void> {
  if (payment.subscription_id) {
    return;
  }

  const userId = await resolveUserId(ctx, {
    metadataUserId: readMetadataString(payment.metadata, "userId"),
    email: payment.customer.email,
  });

  if (!userId) {
    console.error("[DODO WEBHOOK] No userId for order", {
      paymentId: payment.payment_id,
    });
    return;
  }

  const existingOrder = await ctx.runQuery(
    internal.features.subscriptions.queries.getOrderByPlatformOrderId,
    { platformOrderId: payment.payment_id },
  );

  if (existingOrder) {
    return;
  }

  const productId = payment.product_cart?.[0]?.product_id;
  if (!productId) {
    console.error("[DODO WEBHOOK] Missing product id on payment", {
      paymentId: payment.payment_id,
    });
    return;
  }

  const product = await getDodoProduct(productId);
  const creditAmount = parseCreditAmount(product.metadata?.credits);

  if (creditAmount <= 0) {
    console.error("[DODO WEBHOOK] Invalid credit amount on product", {
      paymentId: payment.payment_id,
      productId,
    });
    return;
  }

  await ctx.runMutation(internal.features.subscriptions.mutations.insertOrder, {
    userId,
    platform: "dodo",
    platformOrderId: payment.payment_id,
    platformProductId: productId,
    amount: creditAmount,
    status: "paid",
  });

  await ctx.runMutation(internal.features.credits.mutations.addCreditsToUser, {
    userId,
    amount: creditAmount,
  });
}

export const dodoWebhookHandler = createDodoWebhookHandler({
  onPaymentSucceeded: async (ctx, payload) => {
    await processPaidOrder(ctx, payload.data);
  },
  onSubscriptionActive: async (ctx, payload) => {
    await processSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.active",
    );
  },
  onSubscriptionRenewed: async (ctx, payload) => {
    await processSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.renewed",
    );
  },
  onSubscriptionUpdated: async (ctx, payload) => {
    await processSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.updated",
    );
  },
  onSubscriptionPlanChanged: async (ctx, payload) => {
    await processSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.plan_changed",
    );
  },
  onSubscriptionCancelled: async (ctx, payload) => {
    await processSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.cancelled",
    );
  },
  onSubscriptionOnHold: async (ctx, payload) => {
    await processSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.on_hold",
    );
  },
  onSubscriptionFailed: async (ctx, payload) => {
    await processSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.failed",
    );
  },
  onSubscriptionExpired: async (ctx, payload) => {
    await processSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.expired",
    );
  },
  onSubscriptionPaused: async (ctx, payload) => {
    await processSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.paused",
    );
  },
  onSubscriptionUnpaused: async (ctx, payload) => {
    await processSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.updated",
    );
  },
});
