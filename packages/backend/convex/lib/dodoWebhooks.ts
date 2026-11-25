import { createDodoWebhookHandler } from "@dodopayments/convex";
import type { Payment, Subscription } from "@dodopayments/convex";
import { internal } from "../_generated/api";
import type { GenericActionCtx, GenericDataModel } from "convex/server";

type WebhookActionCtx = GenericActionCtx<GenericDataModel>;

/**
 * Dodo Payments webhook handlers.
 *
 * Webhook URL: https://<your-deployment>.convex.site/dodopayments-webhook
 * Signature verification and payload validation are handled by the
 * @dodopayments/convex component using DODO_PAYMENTS_WEBHOOK_SECRET.
 *
 * Business logic mirrors the Polar webhook flow in the web app:
 * - subscription lifecycle events upsert into the shared `subscriptions` table
 *   with platform "dodo" and sync premium status
 * - cycle credits (1000 monthly / 5000 yearly) are granted exactly once per
 *   period via the subscriptionCreditGrants ledger, so webhook event ordering
 *   can never skip or double a grant
 * - one-time credit purchases (payment.succeeded without a subscription) are
 *   recorded in the shared `orders` table and credits are read from the
 *   product's `credits` metadata key, same as Polar
 */

type DodoSubscriptionStatus = Subscription["status"];

type InternalSubscriptionStatus =
  | "active"
  | "canceled"
  | "expired"
  | "past_due"
  | "trialing";

function toEpochMs(value: Date | string | null | undefined): number | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return value.getTime();
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? undefined : time;
}

function getMetadataUserId(metadata: unknown): string | null {
  if (!metadata || typeof metadata !== "object") return null;
  const userId = (metadata as Record<string, unknown>).userId;
  return typeof userId === "string" && userId.trim().length > 0
    ? userId.trim()
    : null;
}

/**
 * Map Dodo subscription status to the shared internal status enum.
 * Unknown or pre-activation states always map to non-active values so
 * premium access is never granted before payment is confirmed.
 */
function mapDodoSubscriptionStatus(
  status: DodoSubscriptionStatus,
  cancelAtNextBillingDate: boolean,
): InternalSubscriptionStatus {
  if (cancelAtNextBillingDate && status === "active") {
    return "canceled";
  }

  switch (status) {
    case "active":
      return "active";
    case "cancelled":
      return "canceled";
    case "on_hold":
    case "paused":
      return "past_due";
    case "pending":
      return "trialing";
    case "failed":
    case "expired":
    default:
      return "expired";
  }
}

/**
 * Map Dodo billing interval to the internal productType used by both
 * Polar ("monthly" / "yearly") and the pricing UI.
 */
function getDodoProductKey(
  interval: Subscription["payment_frequency_interval"],
): string | undefined {
  if (interval === "Month") return "monthly";
  if (interval === "Year") return "yearly";
  return undefined;
}

async function resolveDodoUserId(
  ctx: WebhookActionCtx,
  subscriptionId: string,
  metadata: unknown,
): Promise<string | null> {
  const metadataUserId = getMetadataUserId(metadata);
  if (metadataUserId) {
    return metadataUserId;
  }

  // Renewal and update events may lack checkout metadata if the session was
  // created outside this app; fall back to the existing subscription row.
  const existingSubscription = await ctx.runQuery(
    internal.features.subscriptions.queries
      .getSubscriptionByPlatformSubscriptionId,
    { platformSubscriptionId: subscriptionId },
  );

  if (existingSubscription) {
    console.log("[DODO WEBHOOK] Resolved user from existing subscription");
    return existingSubscription.userId;
  }

  return null;
}

async function processDodoSubscriptionEvent(
  ctx: WebhookActionCtx,
  data: Subscription,
  eventType: string,
) {
  const subscriptionId = data.subscription_id;
  const customerId = data.customer.customer_id;
  const productId = data.product_id;

  if (!subscriptionId || !customerId || !productId) {
    console.error("[DODO WEBHOOK] Missing subscription identifiers", {
      subscriptionId,
      customerId,
      productId,
    });
    return;
  }

  const userId = await resolveDodoUserId(ctx, subscriptionId, data.metadata);
  if (!userId) {
    console.error(
      "[DODO WEBHOOK] Could not resolve user for subscription event",
      { eventType, subscriptionId, email: data.customer.email },
    );
    return;
  }

  console.log(`[DODO WEBHOOK] Processing ${eventType}`, { subscriptionId });

  const cancelAtNextBillingDate = data.cancel_at_next_billing_date === true;
  const mappedStatus = mapDodoSubscriptionStatus(
    data.status,
    cancelAtNextBillingDate,
  );
  const productType = getDodoProductKey(data.payment_frequency_interval);
  const currentPeriodStart = toEpochMs(data.previous_billing_date);
  const currentPeriodEnd = toEpochMs(data.next_billing_date);
  const canceledAt = toEpochMs(data.cancelled_at);

  const result = await ctx.runMutation(
    internal.features.subscriptions.mutations.upsertSubscription,
    {
      userId,
      platform: "dodo",
      platformCustomerId: customerId,
      platformSubscriptionId: subscriptionId,
      platformProductId: productId,
      customerEmail: data.customer.email || "",
      customerName: data.customer.name || undefined,
      status: mappedStatus,
      productType,
      currentPeriodStart,
      currentPeriodEnd,
      canceledAt,
    },
  );

  console.log("[DODO WEBHOOK] Subscription upserted", {
    subscriptionId,
    status: mappedStatus,
    isNew: result.isNew,
    isRenewal: result.isRenewal,
  });

  const hasActiveSubscription =
    mappedStatus === "active" && !cancelAtNextBillingDate;
  await ctx.runMutation(
    internal.features.premium.mutations.syncPremiumFromSubscription,
    {
      userId,
      hasActiveSubscription,
    },
  );

  // Grant cycle credits once per billing period. Keyed on period start, so
  // it is immune to webhook ordering (unlike event-name-based detection).
  const isCreditEvent =
    eventType === "subscription.active" || eventType === "subscription.renewed";
  const isInPaidPeriod =
    mappedStatus === "active" || mappedStatus === "canceled";

  if (isCreditEvent && isInPaidPeriod && currentPeriodStart !== undefined) {
    const creditsPerCycle =
      data.payment_frequency_interval === "Year" ? 5000 : 1000;
    const grant = await ctx.runMutation(
      internal.features.credits.mutations.grantSubscriptionCycleCredits,
      {
        userId,
        platformSubscriptionId: subscriptionId,
        periodStart: currentPeriodStart,
        credits: creditsPerCycle,
      },
    );
    console.log(
      grant.granted
        ? `[DODO WEBHOOK] Granted ${creditsPerCycle} cycle credits`
        : "[DODO WEBHOOK] Cycle credits already granted for this period",
    );
  }

  return result;
}

function dodoApiBaseUrl(): string {
  return process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com";
}

/**
 * Fetch the credit amount for a one-time product from the Dodo API.
 * Credit amounts live in product metadata under the `credits` key,
 * matching the Polar product metadata convention.
 */
async function fetchDodoProductCredits(productId: string): Promise<number> {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    console.error("[DODO WEBHOOK] DODO_PAYMENTS_API_KEY is not configured");
    return 0;
  }

  const response = await fetch(`${dodoApiBaseUrl()}/products/${productId}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!response.ok) {
    console.error("[DODO WEBHOOK] Failed to fetch product", {
      productId,
      status: response.status,
    });
    return 0;
  }

  const product = (await response.json()) as {
    metadata?: Record<string, unknown>;
  };
  const credits = parseInt(String(product.metadata?.credits ?? "0"), 10);
  return Number.isNaN(credits) ? 0 : credits;
}

async function processDodoPaymentSucceeded(ctx: WebhookActionCtx, data: Payment) {
  // Subscription charges are fulfilled by the subscription lifecycle events.
  if (data.subscription_id) {
    console.log("[DODO WEBHOOK] Subscription charge, skipping order flow", {
      paymentId: data.payment_id,
    });
    return;
  }

  const userId = getMetadataUserId(data.metadata);
  if (!userId) {
    console.error("[DODO WEBHOOK] No userId in payment metadata", {
      paymentId: data.payment_id,
    });
    return;
  }

  const existingOrder = await ctx.runQuery(
    internal.features.subscriptions.queries.getOrderByPlatformOrderId,
    { platformOrderId: data.payment_id },
  );

  if (existingOrder) {
    console.log(
      `[DODO WEBHOOK] Order ${data.payment_id} already processed, skipping`,
    );
    return;
  }

  const cart = data.product_cart ?? [];
  if (cart.length !== 1) {
    console.error("[DODO WEBHOOK] Unsupported cart size for credit order", {
      paymentId: data.payment_id,
      items: cart.length,
    });
    return;
  }

  const productId = cart[0].product_id;
  const creditAmount = await fetchDodoProductCredits(productId);

  if (!creditAmount || creditAmount <= 0) {
    console.error(
      "[DODO WEBHOOK] Invalid or missing credit amount in product metadata:",
      productId,
    );
    return;
  }

  await ctx.runMutation(internal.features.subscriptions.mutations.insertOrder, {
    userId,
    platform: "dodo",
    platformOrderId: data.payment_id,
    platformProductId: productId,
    amount: creditAmount,
    status: "paid",
  });

  const result = await ctx.runMutation(
    internal.features.credits.mutations.addCreditsToUser,
    {
      userId,
      amount: creditAmount,
    },
  );

  console.log(`[DODO WEBHOOK] Added ${creditAmount} credits`, result);
}

export const handleDodoWebhook = createDodoWebhookHandler({
  onSubscriptionActive: async (ctx, payload) => {
    await processDodoSubscriptionEvent(ctx, payload.data, "subscription.active");
  },
  onSubscriptionRenewed: async (ctx, payload) => {
    await processDodoSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.renewed",
    );
  },
  onSubscriptionUpdated: async (ctx, payload) => {
    await processDodoSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.updated",
    );
  },
  onSubscriptionCancelled: async (ctx, payload) => {
    await processDodoSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.cancelled",
    );
  },
  onSubscriptionExpired: async (ctx, payload) => {
    await processDodoSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.expired",
    );
  },
  onSubscriptionOnHold: async (ctx, payload) => {
    await processDodoSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.on_hold",
    );
  },
  onSubscriptionPaused: async (ctx, payload) => {
    await processDodoSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.paused",
    );
  },
  onSubscriptionUnpaused: async (ctx, payload) => {
    await processDodoSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.unpaused",
    );
  },
  onSubscriptionFailed: async (ctx, payload) => {
    await processDodoSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.failed",
    );
  },
  onSubscriptionPlanChanged: async (ctx, payload) => {
    await processDodoSubscriptionEvent(
      ctx,
      payload.data,
      "subscription.plan_changed",
    );
  },
  onPaymentSucceeded: async (ctx, payload) => {
    await processDodoPaymentSucceeded(ctx, payload.data);
  },
});
