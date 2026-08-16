export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "expired"
  | "past_due"
  | "trialing";

export type DodoSubscriptionStatus =
  | "pending"
  | "active"
  | "on_hold"
  | "paused"
  | "cancelled"
  | "failed"
  | "expired";

export type DodoTimeInterval = "Day" | "Week" | "Month" | "Year";

export type CatalogProduct = {
  id: string;
  name: string;
  description?: string;
  prices: Array<{
    priceAmount: number;
    priceCurrency: string;
    recurringInterval?: string;
  }>;
  metadata?: {
    credits?: string;
  };
};

export type DodoProductListItem = {
  product_id: string;
  name?: string | null;
  description?: string | null;
  is_recurring: boolean;
  currency?: string | null;
  price?: number | null;
  metadata?: Record<string, string | number | boolean>;
  price_detail?: {
    type?: "one_time_price" | "recurring_price" | "usage_based_price";
    payment_frequency_interval?: DodoTimeInterval;
    price?: number;
    currency?: string;
  } | null;
};

export function mapDodoSubscriptionStatus(
  status: DodoSubscriptionStatus,
  cancelAtNextBillingDate?: boolean,
): SubscriptionStatus {
  if (cancelAtNextBillingDate && status === "active") {
    return "canceled";
  }

  switch (status) {
    case "pending":
      return "trialing";
    case "active":
      return "active";
    case "cancelled":
      return "canceled";
    case "expired":
      return "expired";
    case "on_hold":
    case "paused":
    case "failed":
      return "past_due";
    default:
      return "active";
  }
}

export function mapDodoIntervalToProductType(
  interval: DodoTimeInterval | string | undefined,
): string | undefined {
  if (!interval) {
    return undefined;
  }

  const normalized = interval.toLowerCase();
  if (normalized === "month") {
    return "monthly";
  }
  if (normalized === "year") {
    return "yearly";
  }
  return undefined;
}

export function mapDodoIntervalToPolarInterval(
  interval: DodoTimeInterval | string | undefined,
): string | undefined {
  if (!interval) {
    return undefined;
  }

  const normalized = interval.toLowerCase();
  if (normalized === "month" || normalized === "year") {
    return normalized;
  }
  return undefined;
}

export function creditsForSubscriptionCycle(
  interval: DodoTimeInterval | string | undefined,
): number {
  return mapDodoIntervalToProductType(interval) === "yearly" ? 5000 : 1000;
}

export function readMetadataString(
  metadata: unknown,
  key: string,
): string | undefined {
  if (!metadata || typeof metadata !== "object") {
    return undefined;
  }

  const value = (metadata as Record<string, unknown>)[key];
  if (typeof value === "string" && value.length > 0) {
    return value;
  }
  if (typeof value === "number") {
    return String(value);
  }
  return undefined;
}

export function parseCreditAmount(
  value: string | number | boolean | undefined,
): number {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.floor(value);
  }
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }
  return 0;
}

export function normalizeDodoProduct(
  product: DodoProductListItem,
): CatalogProduct {
  const priceDetail = product.price_detail;
  const priceAmount = priceDetail?.price ?? product.price ?? 0;
  const priceCurrency = priceDetail?.currency ?? product.currency ?? "USD";
  const recurringInterval =
    priceDetail?.type === "recurring_price"
      ? mapDodoIntervalToPolarInterval(priceDetail.payment_frequency_interval)
      : undefined;
  const credits = parseCreditAmount(product.metadata?.credits);

  return {
    id: product.product_id,
    name: product.name || "Untitled product",
    description: product.description ?? undefined,
    prices: [
      {
        priceAmount,
        priceCurrency,
        recurringInterval,
      },
    ],
    metadata:
      credits > 0
        ? {
            credits: String(credits),
          }
        : undefined,
  };
}

export function toEpochMs(value: Date | string | number | null | undefined): number | undefined {
  if (value == null) {
    return undefined;
  }
  if (value instanceof Date) {
    return value.getTime();
  }
  if (typeof value === "number") {
    return value;
  }
  const parsed = new Date(value).getTime();
  return Number.isNaN(parsed) ? undefined : parsed;
}
