import type { CatalogProduct, DodoProductListItem } from "./dodoMapping";
import { normalizeDodoProduct } from "./dodoMapping";
import { getDodoApiBaseUrl } from "./paymentProvider";

type DodoProductListResponse = {
  items?: DodoProductListItem[];
};

export async function listDodoProducts(
  recurring: boolean,
): Promise<CatalogProduct[]> {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error("DODO_PAYMENTS_API_KEY is not configured");
  }

  const url = new URL("/products", getDodoApiBaseUrl());
  url.searchParams.set("recurring", String(recurring));
  url.searchParams.set("page_size", "100");
  url.searchParams.set("archived", "false");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Dodo products");
  }

  const payload = (await response.json()) as DodoProductListResponse;
  return (payload.items ?? []).map(normalizeDodoProduct);
}

export async function getDodoProduct(
  productId: string,
): Promise<DodoProductListItem> {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  if (!apiKey) {
    throw new Error("DODO_PAYMENTS_API_KEY is not configured");
  }

  const url = new URL(`/products/${productId}`, getDodoApiBaseUrl());
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch Dodo product");
  }

  return (await response.json()) as DodoProductListItem;
}
