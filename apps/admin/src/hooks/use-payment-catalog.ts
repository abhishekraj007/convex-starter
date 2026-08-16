"use client";

import { useQuery } from "@tanstack/react-query";
import type { CatalogProduct } from "@/lib/billing-catalog";
import { getClientPaymentProvider } from "@/lib/payment-provider";

const CATALOG_STALE_TIME = 5 * 60 * 1000;
const CATALOG_GC_TIME = 30 * 60 * 1000;

async function fetchCatalog(path: string): Promise<CatalogProduct[]> {
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }
  return (await response.json()) as CatalogProduct[];
}

export function useCreditProductsQuery(enabled: boolean) {
  const provider = getClientPaymentProvider();

  return useQuery({
    queryKey: ["billing", provider, "products"],
    queryFn: () => fetchCatalog("/api/billing/products"),
    enabled,
    staleTime: CATALOG_STALE_TIME,
    gcTime: CATALOG_GC_TIME,
  });
}

export function useSubscriptionProductsQuery(enabled: boolean) {
  const provider = getClientPaymentProvider();

  return useQuery({
    queryKey: ["billing", provider, "subscriptions"],
    queryFn: () => fetchCatalog("/api/billing/subscriptions"),
    enabled,
    staleTime: CATALOG_STALE_TIME,
    gcTime: CATALOG_GC_TIME,
  });
}
