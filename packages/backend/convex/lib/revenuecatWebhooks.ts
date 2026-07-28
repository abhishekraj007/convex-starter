import { api, internal } from "../_generated/api";
import { httpAction } from "../_generated/server";
import type { ActionCtx } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { getCreditAmountFromProductId } from "../features/appConfig/shared";
import {
  getRevenueCatProductKey,
  isRevenueCatSubscriptionProduct,
} from "./revenuecatProducts";

/**
 * RevenueCat Webhook Handlers
 * Handles subscription events from RevenueCat for mobile apps
 *
 * Webhook URL: https://your-site.convex.site/revenuecat/webhooks
 *
 * RevenueCat Event Types:
 * - INITIAL_PURCHASE: First subscription purchase
 * - RENEWAL: Subscription renewed
 * - CANCELLATION: Subscription cancelled (still active until period end)
 * - UNCANCELLATION: Cancelled subscription reactivated
 * - NON_RENEWING_PURCHASE: One-time purchase
 * - EXPIRATION: Subscription expired
 * - BILLING_ISSUE: Payment failed
 * - PRODUCT_CHANGE: User changed subscription tier
 */

type RevenueCatSubscriberAttribute =
  | {
      value?: unknown;
    }
  | string
  | null
  | undefined;

type ResolvedRevenueCatUser = {
  userId: string;
  source: string;
};

const REVENUECAT_ANONYMOUS_ID_PREFIX = "$RCAnonymousID:";

const REVENUECAT_AUTH_USER_ATTRIBUTE_KEYS = [
  "authUserId",
  "betterAuthUserId",
  "appUserId",
  "userId",
];

/**
 * RevenueCat webhook event structure
 */
interface RevenueCatEvent {
  api_version: string;
  event: {
    type: string;
    app_user_id?: string;
    original_app_user_id?: string;
    aliases?: string[];
    product_id?: string;
    period_type?: "TRIAL" | "INTRO" | "NORMAL" | null;
    purchased_at_ms: number;
    expiration_at_ms?: number | null;
    store: "APP_STORE" | "PLAY_STORE" | "STRIPE" | "PROMOTIONAL";
    environment: "SANDBOX" | "PRODUCTION";
    entitlement_ids?: Array<string> | null;
    entitlement_id?: string | null;
    presented_offering_id?: string;
    transaction_id?: string;
    original_transaction_id?: string;
    is_family_share?: boolean;
    country_code?: string;
    price?: number;
    currency?: string;
    subscriber_attributes?: Record<string, RevenueCatSubscriberAttribute>;
    transferred_from?: string[];
    transferred_to?: string[];
    takehome_percentage?: number;
    offer_code?: string;
    cancel_reason?:
      | "UNSUBSCRIBE"
      | "BILLING_ERROR"
      | "DEVELOPER_INITIATED"
      | "PRICE_INCREASE"
      | "CUSTOMER_SUPPORT"
      | "UNKNOWN";
  };
}

type SubscriptionUpsertResult = {
  subscriptionId: Id<"subscriptions">;
  isNew: boolean;
  isRenewal: boolean;
};

function logRevenueCatOperation(
  operation: string,
  event: RevenueCatEvent["event"],
): void {
  console.log(`[REVENUECAT] ${operation}`, {
    eventType: event.type,
    productId: event.product_id ?? "none",
    store: event.store,
    environment: event.environment,
  });
}

function getRevenueCatPlatformSubscriptionId(
  event: RevenueCatEvent["event"],
): string | null {
  return (
    event.original_transaction_id ||
    event.transaction_id ||
    event.product_id ||
    null
  );
}

function isRevenueCatAnonymousId(userId: string | null | undefined): boolean {
  return !userId || userId.startsWith(REVENUECAT_ANONYMOUS_ID_PREFIX);
}

function getSubscriberAttributeValue(
  attributes: RevenueCatEvent["event"]["subscriber_attributes"],
  key: string,
): string | undefined {
  const attribute = attributes?.[key];

  if (typeof attribute === "string") {
    return attribute.trim() || undefined;
  }

  if (!attribute || typeof attribute !== "object") {
    return undefined;
  }

  const value = attribute.value;
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

function getRevenueCatUserCandidates(
  event: RevenueCatEvent["event"],
): Array<{ userId: string; source: string }> {
  const candidates: Array<{ userId: string; source: string }> = [];

  const addCandidate = (userId: string | null | undefined, source: string) => {
    const trimmedUserId = userId?.trim();

    if (!trimmedUserId) {
      return;
    }

    if (candidates.some((candidate) => candidate.userId === trimmedUserId)) {
      return;
    }

    candidates.push({ userId: trimmedUserId, source });
  };

  for (const transferredUserId of event.transferred_to ?? []) {
    addCandidate(transferredUserId, "transferred_to");
  }

  addCandidate(event.app_user_id, "app_user_id");
  addCandidate(event.original_app_user_id, "original_app_user_id");

  for (const alias of event.aliases ?? []) {
    addCandidate(alias, "aliases");
  }

  for (const key of REVENUECAT_AUTH_USER_ATTRIBUTE_KEYS) {
    addCandidate(
      getSubscriberAttributeValue(event.subscriber_attributes, key),
      `subscriber_attributes.${key}`,
    );
  }

  return candidates;
}

async function resolveRevenueCatWebhookUser(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
): Promise<ResolvedRevenueCatUser | null> {
  const identifiedCandidate = getRevenueCatUserCandidates(event).find(
    (candidate) => !isRevenueCatAnonymousId(candidate.userId),
  );

  if (identifiedCandidate) {
    return identifiedCandidate;
  }

  const platformSubscriptionId = getRevenueCatPlatformSubscriptionId(event);
  const existingSubscription = platformSubscriptionId
    ? await ctx.runQuery(
        internal.features.subscriptions.queries
          .getSubscriptionByPlatformSubscriptionId,
        {
          platformSubscriptionId,
        },
      )
    : null;

  if (
    existingSubscription &&
    !isRevenueCatAnonymousId(existingSubscription.userId)
  ) {
    return {
      userId: existingSubscription.userId,
      source: "existing_subscription",
    };
  }

  return null;
}

/**
 * Main webhook handler
 */
export const handleRevenueCatWebhook = httpAction(async (ctx, request) => {
  try {
    // Verify webhook Authorization. Fail closed when the secret is unset
    // outside explicit development (CONVEX_ENV=development).
    const authHeader = request.headers.get("Authorization");
    const expectedAuth = process.env.REVENUECAT_WEBHOOK_SECRET;
    const isExplicitDevelopment = process.env.CONVEX_ENV === "development";
    console.log("[REVENUECAT WEBHOOK] Received webhook", {
      hasAuthHeader: Boolean(authHeader),
      hasExpectedAuth: Boolean(expectedAuth),
    });

    if (!expectedAuth) {
      if (!isExplicitDevelopment) {
        console.error(
          "[REVENUECAT WEBHOOK] REVENUECAT_WEBHOOK_SECRET is not configured",
        );
        return new Response("Unauthorized", { status: 401 });
      }
      console.warn(
        "[REVENUECAT WEBHOOK] Secret unset; allowing request in development only",
      );
    } else if (authHeader !== expectedAuth) {
      console.error("[REVENUECAT WEBHOOK] Invalid authorization");
      return new Response("Unauthorized", { status: 401 });
    }

    const body = (await request.json()) as RevenueCatEvent;
    const event = body.event;

    console.log("[REVENUECAT WEBHOOK] Event type:", event.type);
    console.log("[REVENUECAT WEBHOOK] Product ID:", event.product_id ?? "none");

    const resolvedUser = await resolveRevenueCatWebhookUser(ctx, event);

    if (!resolvedUser) {
      console.warn(
        "[REVENUECAT WEBHOOK] Skipping event without an identified app user ID",
        {
          eventType: event.type,
          productId: event.product_id,
          candidateCount: getRevenueCatUserCandidates(event).length,
          platformSubscriptionId: getRevenueCatPlatformSubscriptionId(event),
        },
      );
      return new Response("OK", { status: 200 });
    }

    const userId = resolvedUser.userId;

    console.log("[REVENUECAT WEBHOOK] Resolved user", {
      source: resolvedUser.source,
    });

    // Route to appropriate handler based on event type
    switch (event.type) {
      case "INITIAL_PURCHASE":
        await handleInitialPurchase(ctx, event, userId);
        break;

      case "RENEWAL":
        await handleRenewal(ctx, event, userId);
        break;

      case "CANCELLATION":
        await handleCancellation(ctx, event, userId);
        break;

      case "UNCANCELLATION":
        await handleUncancellation(ctx, event, userId);
        break;

      case "NON_RENEWING_PURCHASE":
        await handleNonRenewingPurchase(ctx, event, userId);
        break;

      case "EXPIRATION":
        await handleExpiration(ctx, event, userId);
        break;

      case "BILLING_ISSUE":
        await handleBillingIssue(ctx, event, userId);
        break;

      case "PRODUCT_CHANGE":
        await handleProductChange(ctx, event, userId);
        break;

      case "TRANSFER":
        await handleTransfer(ctx, event, userId);
        break;

      default:
        console.log("[REVENUECAT WEBHOOK] Unhandled event type:", event.type);
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[REVENUECAT WEBHOOK] Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

/**
 * Handle initial purchase (first subscription or one-time purchase)
 */
async function handleInitialPurchase(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
) {
  logRevenueCatOperation("Processing initial purchase", event);

  const isSubscription = isRevenueCatSubscriptionProduct(event);

  if (isSubscription) {
    const result = await createOrUpdateSubscription(
      ctx,
      event,
      userId,
      "active",
    );

    await ctx.runMutation(
      internal.features.premium.mutations.syncPremiumFromSubscription,
      {
        userId,
        hasActiveSubscription: true,
      },
    );

    if (result.isNew) {
      await ctx.runMutation(
        internal.features.credits.mutations.addBonusCredits,
        {
          userId,
          bonusCredits: 1000,
        },
      );
      console.log("[REVENUECAT] Added 1000 bonus credits for new subscription");
    }
  } else {
    await handleCreditPurchase(ctx, event, userId);
  }
}

/**
 * Handle subscription renewal
 */
async function handleRenewal(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
) {
  logRevenueCatOperation("Processing renewal", event);

  const result = await createOrUpdateSubscription(ctx, event, userId, "active");

  await ctx.runMutation(
    internal.features.premium.mutations.syncPremiumFromSubscription,
    {
      userId,
      hasActiveSubscription: true,
    },
  );

  if (result.isRenewal) {
    await ctx.runMutation(internal.features.credits.mutations.addBonusCredits, {
      userId,
      bonusCredits: 1000,
    });
    console.log("[REVENUECAT] Added 1000 bonus credits for renewal");
  } else {
    console.log("[REVENUECAT] Renewal already processed, skipping credits");
  }
}

/**
 * Handle subscription cancellation
 */
async function handleCancellation(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
) {
  logRevenueCatOperation("Processing cancellation", event);
  console.log("[REVENUECAT] Cancel reason:", event.cancel_reason);

  await createOrUpdateSubscription(ctx, event, userId, "canceled");

  console.log(
    "[REVENUECAT] Subscription canceled, will expire at:",
    event.expiration_at_ms ? new Date(event.expiration_at_ms) : "unknown",
  );
}

/**
 * Handle subscription uncancellation (reactivation)
 */
async function handleUncancellation(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
) {
  logRevenueCatOperation("Processing uncancellation", event);

  await createOrUpdateSubscription(ctx, event, userId, "active");

  await ctx.runMutation(
    internal.features.premium.mutations.syncPremiumFromSubscription,
    {
      userId,
      hasActiveSubscription: true,
    },
  );
}

/**
 * Handle non-renewing purchase (one-time purchase)
 */
async function handleNonRenewingPurchase(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
) {
  logRevenueCatOperation("Processing non-renewing purchase", event);

  await handleCreditPurchase(ctx, event, userId);
}

/**
 * Handle subscription expiration
 */
async function handleExpiration(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
) {
  logRevenueCatOperation("Processing expiration", event);

  await createOrUpdateSubscription(ctx, event, userId, "expired");

  await ctx.runMutation(
    internal.features.premium.mutations.syncPremiumFromSubscription,
    {
      userId,
      hasActiveSubscription: false,
    },
  );

  console.log("[REVENUECAT] Subscription expired - premium revoked");
}

/**
 * Handle billing issue
 */
async function handleBillingIssue(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
) {
  logRevenueCatOperation("Processing billing issue", event);

  await createOrUpdateSubscription(ctx, event, userId, "past_due");

  console.log(
    "[REVENUECAT] Billing issue detected - subscription in grace period",
  );
}

/**
 * Handle product change (upgrade/downgrade)
 */
async function handleProductChange(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
) {
  logRevenueCatOperation("Processing product change", event);

  await createOrUpdateSubscription(ctx, event, userId, "active");

  await ctx.runMutation(
    internal.features.premium.mutations.syncPremiumFromSubscription,
    {
      userId,
      hasActiveSubscription: true,
    },
  );
}

/**
 * Handle transfer events created by restore/alias flows
 */
async function handleTransfer(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
) {
  logRevenueCatOperation("Processing transfer", event);

  if (!isRevenueCatSubscriptionProduct(event)) {
    console.log("[REVENUECAT] Transfer does not include premium access");
    return;
  }

  if (event.product_id) {
    await createOrUpdateSubscription(ctx, event, userId, "active");
  } else {
    console.log("[REVENUECAT] Transfer missing product_id, skipping upsert");
  }

  await ctx.runMutation(
    internal.features.premium.mutations.syncPremiumFromSubscription,
    {
      userId,
      hasActiveSubscription: true,
    },
  );

  for (const previousUserId of event.transferred_from ?? []) {
    if (isRevenueCatAnonymousId(previousUserId) || previousUserId === userId) {
      continue;
    }

    await ctx.runMutation(
      internal.features.premium.mutations.syncPremiumFromSubscription,
      {
        userId: previousUserId,
        hasActiveSubscription: false,
      },
    );
  }

  console.log("[REVENUECAT] Transfer processed");
}

/**
 * Create or update subscription record
 */
async function createOrUpdateSubscription(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
  status: "active" | "canceled" | "expired" | "past_due",
): Promise<SubscriptionUpsertResult> {
  if (!event.product_id) {
    throw new Error("RevenueCat event missing product_id");
  }

  const platformSubscriptionId = getRevenueCatPlatformSubscriptionId(event);

  if (!platformSubscriptionId) {
    throw new Error("RevenueCat event missing subscription identifier");
  }

  const productType = getRevenueCatProductKey(event.product_id);

  console.log("createOrUpdateSubscription", {
    status,
    productType,
    eventType: event.type,
    productId: event.product_id,
  });

  const result: SubscriptionUpsertResult = await ctx.runMutation(
    internal.features.subscriptions.mutations.upsertSubscription,
    {
      userId,
      platform: "revenuecat" as const,
      platformCustomerId: event.original_app_user_id ?? userId,
      platformSubscriptionId,
      platformProductId: event.product_id,
      customerEmail:
        getSubscriberAttributeValue(event.subscriber_attributes, "$email") ??
        getSubscriberAttributeValue(event.subscriber_attributes, "email") ??
        "",
      customerName:
        getSubscriberAttributeValue(
          event.subscriber_attributes,
          "$displayName",
        ) ?? getSubscriberAttributeValue(event.subscriber_attributes, "name"),
      status,
      productType,
      currentPeriodStart: event.purchased_at_ms,
      currentPeriodEnd: event.expiration_at_ms ?? undefined,
      canceledAt: status === "canceled" ? Date.now() : undefined,
    },
  );

  return result;
}

/**
 * Handle credit purchase (one-time)
 */
async function handleCreditPurchase(
  ctx: ActionCtx,
  event: RevenueCatEvent["event"],
  userId: string,
) {
  const productId = event.product_id;

  if (!productId) {
    console.log("[REVENUECAT] Credit purchase missing product_id");
    return;
  }

  const appConfig = await ctx.runQuery(
    api.features.appConfig.queries.getPublicAppConfig,
    {},
  );

  if (!appConfig.revenueCatCreditProductIds.includes(productId)) {
    console.log(
      "[REVENUECAT] Product is not a configured credit purchase:",
      productId,
    );
    return;
  }

  const creditAmount = getCreditAmountFromProductId(productId);

  console.log(
    "[REVENUECAT] Handling credit purchase",
    JSON.stringify({ productId, creditAmount }, null, 2),
  );

  if (!creditAmount) {
    console.log("[REVENUECAT] Could not derive credit amount:", productId);
    return;
  }

  const orderId =
    event.transaction_id || event.original_transaction_id || productId;

  const existingOrder = await ctx.runQuery(
    internal.features.subscriptions.queries.getOrderByPlatformOrderId,
    {
      platformOrderId: orderId,
    },
  );

  if (existingOrder) {
    console.log("[REVENUECAT] Order already processed:", existingOrder._id);
    return;
  }

  await ctx.runMutation(internal.features.subscriptions.mutations.insertOrder, {
    userId,
    platform: "revenuecat" as const,
    platformOrderId: orderId,
    platformProductId: productId,
    amount: creditAmount,
    status: "paid" as const,
  });

  await ctx.runMutation(internal.features.credits.mutations.addCreditsToUser, {
    userId,
    amount: creditAmount,
  });

  console.log(
    "[REVENUECAT] Added credits to user",
    JSON.stringify({ creditAmount }),
  );
}
