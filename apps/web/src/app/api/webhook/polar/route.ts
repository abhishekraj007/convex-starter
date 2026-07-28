// src/app/api/webhook/polar/route.ts
import { Webhooks } from "@polar-sh/nextjs";
import { fetchAction, api } from "@/lib/convex-client";

type PolarDateLike = string | Date | null | undefined;

type PolarCustomerPayload = {
  data?: {
    id?: string | null;
    customerId?: string | null;
    customer_id?: string | null;
    productId?: string | null;
    product_id?: string | null;
    status?: string | null;
    recurringInterval?: string | null;
    cancelAtPeriodEnd?: boolean | null;
    canceledAt?: PolarDateLike;
    currentPeriodStart?: PolarDateLike;
    currentPeriodEnd?: PolarDateLike;
    metadata?: { userId?: string | null } | null;
    customer?: {
      externalId?: string | null;
      email?: string | null;
      name?: string | null;
    } | null;
    customer_email?: string | null;
    customer_name?: string | null;
    product?: {
      id?: string | null;
      isRecurring?: boolean | null;
      recurringInterval?: string | null;
      metadata?: { credits?: string | null } | null;
    } | null;
  } | null;
};

function toEpochMs(value: PolarDateLike): number | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return value.getTime();
  return new Date(value).getTime();
}

/**
 * Map Polar product interval to our internal productType
 * Since we fetch products dynamically, we derive the type from the recurring interval
 */
function getProductKey(
  recurringInterval: string | undefined,
): string | undefined {
  if (!recurringInterval) return undefined;

  if (recurringInterval === "month") return "monthly";
  if (recurringInterval === "year") return "yearly";

  return undefined;
}

function requirePolarWebhookSecret(): string {
  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("POLAR_WEBHOOK_SECRET_MISSING");
  }
  return webhookSecret;
}

/**
 * Extract userId from Polar webhook payload
 * Polar includes customer data with externalId (our userId) and email
 */
function getUserFromPayload(payload: PolarCustomerPayload): {
  userId: string | null;
  email: string | null;
  customerName: string | null;
} {
  const customer = payload?.data?.customer;
  const userId =
    customer?.externalId || payload?.data?.metadata?.userId || null;
  const email = customer?.email || payload?.data?.customer_email || null;
  const customerName = customer?.name || payload?.data?.customer_name || null;

  return { userId, email, customerName };
}

/**
 * Process Polar subscription events using Convex actions
 * This is a reusable function that handles all subscription state changes
 */
async function processPolarSubscriptionEvent(
  payload: PolarCustomerPayload,
  eventType: string,
) {
  const webhookSecret = requirePolarWebhookSecret();
  const data = payload?.data;
  if (!data) {
    console.error("[POLAR WEBHOOK] No data in payload");
    return;
  }

  let { userId, email, customerName } = getUserFromPayload(payload);

  if (!userId) {
    console.warn(
      "[POLAR WEBHOOK] No userId (externalId) in payload, attempting to find from existing subscription:",
      { email, subscriptionId: data.id },
    );

    const subscriptionId = data.id;
    if (subscriptionId) {
      try {
        const existingSubscription = await fetchAction(
          api.features.subscriptions.actions.getSubscriptionByPlatformId,
          { platformSubscriptionId: subscriptionId, webhookSecret },
        );

        if (existingSubscription) {
          userId = existingSubscription.userId;
          console.log("[POLAR WEBHOOK] Resolved existing subscription owner");
        } else {
          console.error(
            "[POLAR WEBHOOK] No existing subscription found for platformSubscriptionId:",
            subscriptionId,
          );
          return;
        }
      } catch (error) {
        console.error("[POLAR WEBHOOK] Error looking up subscription:", error);
        return;
      }
    } else {
      console.error(
        "[POLAR WEBHOOK] No userId and no subscriptionId to lookup",
      );
      return;
    }
  }

  if (!userId) {
    return;
  }

  console.log(`[POLAR WEBHOOK] Processing ${eventType}`);

  const subscriptionId = data.id;
  const customerId = data.customerId || data.customer_id;
  const productId = data.productId || data.product_id;
  const status = data.status;
  const recurringInterval =
    data.recurringInterval || data.product?.recurringInterval;

  const isCanceledButActive = data.cancelAtPeriodEnd || data.canceledAt;

  let mappedStatus: "active" | "canceled" | "expired" | "past_due" | "trialing";
  if (isCanceledButActive && status === "active") {
    mappedStatus = "canceled";
  } else if (status === "active") {
    mappedStatus = "active";
  } else if (status === "canceled") {
    mappedStatus = "canceled";
  } else if (status === "past_due") {
    mappedStatus = "past_due";
  } else if (status === "expired" || status === "incomplete_expired") {
    mappedStatus = "expired";
  } else {
    mappedStatus = "active";
  }

  const productType = getProductKey(recurringInterval ?? undefined);
  const currentPeriodStart = toEpochMs(data.currentPeriodStart);
  const currentPeriodEnd = toEpochMs(data.currentPeriodEnd);
  const canceledAt = toEpochMs(data.canceledAt);

  if (!subscriptionId || !customerId || !productId) {
    console.error("[POLAR WEBHOOK] Missing subscription identifiers");
    return;
  }

  const result = await fetchAction(
    api.features.subscriptions.actions.upsertSubscriptionFromWebhook,
    {
      webhookSecret,
      userId,
      platform: "polar" as const,
      platformCustomerId: customerId,
      platformSubscriptionId: subscriptionId,
      platformProductId: productId,
      customerEmail: email || "",
      customerName: customerName || undefined,
      status: mappedStatus,
      productType,
      currentPeriodStart,
      currentPeriodEnd,
      canceledAt,
    },
  );

  console.log(`[POLAR WEBHOOK] Subscription upserted:`, {
    subscriptionId,
    status: mappedStatus,
    isNew: result.isNew,
    isRenewal: result.isRenewal,
  });

  const hasActiveSubscription =
    mappedStatus === "active" && !isCanceledButActive;
  await fetchAction(api.features.subscriptions.actions.syncPremiumFromWebhook, {
    webhookSecret,
    userId,
    hasActiveSubscription,
  });

  if (eventType === "subscription.created" && result.isNew) {
    const creditsPerCycle = recurringInterval === "year" ? 5000 : 1000;
    await fetchAction(
      api.features.subscriptions.actions.addBonusCreditsFromWebhook,
      {
        webhookSecret,
        userId,
        bonusCredits: creditsPerCycle,
      },
    );
  } else if (
    eventType === "subscription.active" &&
    !result.isNew &&
    result.isRenewal
  ) {
    const creditsPerCycle = recurringInterval === "year" ? 5000 : 1000;
    await fetchAction(
      api.features.subscriptions.actions.addBonusCreditsFromWebhook,
      {
        webhookSecret,
        userId,
        bonusCredits: creditsPerCycle,
      },
    );
    console.log(
      `[POLAR WEBHOOK] Added ${creditsPerCycle} credits for subscription renewal`,
    );
  }

  return result;
}

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

  onCustomerDeleted: async (_payload: PolarCustomerPayload) => {
    try {
      console.log("Polar webhook onCustomerDeleted received");
    } catch (err) {
      console.error("Polar webhook onCustomerDeleted error", err);
    }
  },

  onSubscriptionCreated: async (payload: PolarCustomerPayload) => {
    try {
      await processPolarSubscriptionEvent(payload, "subscription.created");
    } catch (err) {
      console.error("Polar webhook onSubscriptionCreated error", err);
      throw err;
    }
  },

  onSubscriptionActive: async (payload: PolarCustomerPayload) => {
    try {
      await processPolarSubscriptionEvent(payload, "subscription.active");
    } catch (err) {
      console.error("Polar webhook onSubscriptionActive error", err);
      throw err;
    }
  },

  onSubscriptionUpdated: async (payload: PolarCustomerPayload) => {
    try {
      await processPolarSubscriptionEvent(payload, "subscription.updated");
    } catch (err) {
      console.error("Polar webhook onSubscriptionUpdated error", err);
      throw err;
    }
  },

  onSubscriptionCanceled: async (payload: PolarCustomerPayload) => {
    try {
      await processPolarSubscriptionEvent(payload, "subscription.canceled");
    } catch (err) {
      console.error("Polar webhook onSubscriptionCanceled error", err);
      throw err;
    }
  },

  onSubscriptionRevoked: async (payload: PolarCustomerPayload) => {
    try {
      await processPolarSubscriptionEvent(payload, "subscription.revoked");
    } catch (err) {
      console.error("Polar webhook onSubscriptionRevoked error", err);
      throw err;
    }
  },

  onOrderPaid: async (payload: PolarCustomerPayload) => {
    try {
      const webhookSecret = requirePolarWebhookSecret();
      const data = payload?.data;

      const { userId } = getUserFromPayload(payload);

      if (!userId) {
        console.error("[POLAR WEBHOOK] No userId for order:", {
          orderId: data?.id,
        });
        return;
      }

      if (!data?.id) {
        console.error("[POLAR WEBHOOK] No order id in payload");
        return;
      }

      const existingOrder = await fetchAction(
        api.features.subscriptions.actions.getOrderByPlatformId,
        { platformOrderId: data.id, webhookSecret },
      );

      if (existingOrder) {
        console.log(
          `[POLAR WEBHOOK] Order ${data.id} already processed, skipping`,
        );
        return;
      }

      const product = data?.product;
      if (product?.isRecurring) {
        console.log("[POLAR WEBHOOK] Recurring product order, skipping");
        return;
      }

      console.log("[POLAR WEBHOOK] Processing paid order");

      const creditAmount = parseInt(product?.metadata?.credits || "0");

      if (!creditAmount || creditAmount <= 0) {
        console.error(
          "[POLAR WEBHOOK] Invalid or missing credit amount in product metadata:",
          product?.id,
        );
        return;
      }

      console.log(
        `[POLAR WEBHOOK] Extracted ${creditAmount} credits from product metadata`,
      );

      await fetchAction(
        api.features.subscriptions.actions.insertOrderFromWebhook,
        {
          webhookSecret,
          userId,
          platform: "polar",
          platformOrderId: data.id,
          platformProductId: product?.id || data.productId || "",
          amount: creditAmount,
          status: "paid",
        },
      );

      const result = await fetchAction(
        api.features.subscriptions.actions.addCreditsFromWebhook,
        {
          webhookSecret,
          userId,
          amount: creditAmount,
        },
      );

      console.log(`[POLAR WEBHOOK] Added ${creditAmount} credits`, result);
    } catch (err) {
      console.error("Polar webhook onOrderPaid error", err);
      throw err;
    }
  },
});
