"use client";

import { useQuery } from "@tanstack/react-query";
import type { BillingProduct } from "@/lib/billing/types";

const BILLING_CATALOG_STALE_TIME = 5 * 60 * 1000;
const BILLING_CATALOG_GC_TIME = 30 * 60 * 1000;

async function fetchBillingProducts() {
  const response = await fetch("/api/billing/products", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return (await response.json()) as BillingProduct[];
}

async function fetchBillingSubscriptions() {
  const response = await fetch("/api/billing/subscriptions", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch subscription plans");
  }

  return (await response.json()) as BillingProduct[];
}

export function useBillingProductsQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["billing", "products"],
    queryFn: fetchBillingProducts,
    enabled,
    staleTime: BILLING_CATALOG_STALE_TIME,
    gcTime: BILLING_CATALOG_GC_TIME,
  });
}

export function useBillingSubscriptionsQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["billing", "subscriptions"],
    queryFn: fetchBillingSubscriptions,
    enabled,
    staleTime: BILLING_CATALOG_STALE_TIME,
    gcTime: BILLING_CATALOG_GC_TIME,
  });
}
