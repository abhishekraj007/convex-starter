import { Polar } from "@polar-sh/sdk";
import DodoPayments from "dodopayments";
import type { BillingProduct, BillingProvider } from "./types";

/**
 * Server-side billing provider resolution and catalog normalization.
 * Only imported by Next.js route handlers — never ship to the client.
 *
 * The active provider is selected with a single env var:
 *   BILLING_PROVIDER=polar (default) | dodo
 *
 * SDK clients are lazily instantiated so that provider-specific env vars are
 * only required when that provider is active.
 */

export function getBillingProvider(): BillingProvider {
  return process.env.BILLING_PROVIDER === "dodo" ? "dodo" : "polar";
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3004";
}

// ---------------------------------------------------------------------------
// Lazy SDK clients
// ---------------------------------------------------------------------------

let polarClient: Polar | null = null;

export function getPolarClient(): Polar {
  if (!polarClient) {
    const accessToken = process.env.POLAR_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("POLAR_ACCESS_TOKEN is not configured");
    }
    polarClient = new Polar({
      accessToken,
      server: process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
    });
  }
  return polarClient;
}

let dodoClient: DodoPayments | null = null;

export function getDodoClient(): DodoPayments {
  if (!dodoClient) {
    const bearerToken = process.env.DODO_PAYMENTS_API_KEY;
    if (!bearerToken) {
      throw new Error("DODO_PAYMENTS_API_KEY is not configured");
    }
    dodoClient = new DodoPayments({
      bearerToken,
      environment:
        process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
          ? "live_mode"
          : "test_mode",
    });
  }
  return dodoClient;
}

// ---------------------------------------------------------------------------
// Catalog normalization
// ---------------------------------------------------------------------------

type DodoProductListItem = Awaited<
  ReturnType<DodoPayments["products"]["list"]>
>["items"][number];

/**
 * Normalize a Dodo product list item into the shared billing shape.
 * Usage-based (metered) products are filtered out before this step — they
 * cannot be represented as fixed-price cards. Returns null when the product
 * has no usable fixed price.
 */
function normalizeDodoProduct(
  product: DodoProductListItem,
): BillingProduct | null {
  const detail = product.price_detail;

  if (!detail || detail.type === "usage_based_price") {
    return null;
  }

  const priceAmount = detail.price ?? product.price;
  const priceCurrency = detail.currency ?? product.currency;

  if (priceAmount == null || priceCurrency == null) {
    return null;
  }

  const interval =
    "payment_frequency_interval" in detail
      ? detail.payment_frequency_interval?.toLowerCase()
      : undefined;

  const credits = product.metadata?.credits;

  return {
    id: product.product_id,
    name: product.name ?? "Plan",
    description: product.description ?? undefined,
    prices: [
      {
        type: detail.type,
        priceAmount,
        priceCurrency,
        recurringInterval: interval,
      },
    ],
    metadata:
      credits != null
        ? { credits: String(credits) }
        : undefined,
  };
}

async function listPolarProducts(recurring: boolean): Promise<BillingProduct[]> {
  const api = getPolarClient();
  const response = await api.products.list({
    organizationId: process.env.POLAR_ORGANIZATION_ID!,
    isRecurring: recurring,
  });

  return (response.result?.items || []) as unknown as BillingProduct[];
}

async function listDodoProducts(recurring: boolean): Promise<BillingProduct[]> {
  const client = getDodoClient();
  const products: BillingProduct[] = [];

  for await (const product of client.products.list({
    recurring,
    archived: false,
  })) {
    const normalized = normalizeDodoProduct(product);
    if (normalized) {
      products.push(normalized);
    }
  }

  return products;
}

/**
 * Unified catalog: one-time credit products or recurring subscription
 * products, normalized into the same shape regardless of provider.
 */
export async function listBillingProducts(
  kind: "one_time" | "recurring",
): Promise<BillingProduct[]> {
  const recurring = kind === "recurring";
  if (getBillingProvider() === "dodo") {
    return listDodoProducts(recurring);
  }
  return listPolarProducts(recurring);
}
