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

type PolarCatalogSource = {
  id: string;
  name?: string | null;
  description?: string | null;
  recurringInterval?: string | null;
  prices?: ReadonlyArray<{
    priceAmount?: number;
    priceCurrency?: string;
    recurringInterval?: string | null;
  }>;
  metadata?: Record<string, string | number | boolean>;
};

export function mapPolarProductToCatalog(
  product: PolarCatalogSource,
): CatalogProduct {
  const creditsValue = product.metadata?.credits ?? product.metadata?.credtis;
  const credits =
    creditsValue === undefined || creditsValue === null
      ? undefined
      : String(creditsValue);

  return {
    id: product.id,
    name: product.name || "Untitled product",
    description: product.description ?? undefined,
    prices: (product.prices ?? []).map((price) => ({
      priceAmount: price.priceAmount ?? 0,
      priceCurrency: price.priceCurrency ?? "USD",
      recurringInterval:
        (typeof price.recurringInterval === "string"
          ? price.recurringInterval
          : undefined) ??
        (typeof product.recurringInterval === "string"
          ? product.recurringInterval
          : undefined),
    })),
    metadata: credits ? { credits } : undefined,
  };
}

export function findCatalogProductByInterval(
  products: CatalogProduct[],
  interval: "month" | "year",
): CatalogProduct | undefined {
  return products.find((product) =>
    product.prices.some((price) => price.recurringInterval === interval),
  );
}

export function getCatalogCreditAmount(product: CatalogProduct): number {
  if (product.metadata?.credits) {
    const parsed = Number.parseInt(product.metadata.credits, 10);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed;
    }
  }

  const match = product.name.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 0;
}
