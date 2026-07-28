import { getCreditAmountFromProductId } from "../features/appConfig/shared";

type RevenueCatProductEvent = {
  product_id?: string;
  entitlement_id?: string | null;
  entitlement_ids?: Array<string> | null;
  expiration_at_ms?: number | null;
};

export function getRevenueCatProductKey(
  productId: string,
): string | undefined {
  const normalizedProductId = productId.toLowerCase();

  if (normalizedProductId.includes("year")) {
    return "yearly";
  }

  if (normalizedProductId.includes("month")) {
    return "monthly";
  }

  const creditAmount = getCreditAmountFromProductId(productId);
  return creditAmount ? `credits${creditAmount}` : undefined;
}

export function isRevenueCatSubscriptionProduct(
  event: RevenueCatProductEvent,
): boolean {
  const productId = event.product_id?.toLowerCase() ?? "";
  const productKey = event.product_id
    ? getRevenueCatProductKey(event.product_id)
    : undefined;

  return (
    event.expiration_at_ms != null ||
    event.entitlement_id === "premium" ||
    event.entitlement_ids?.includes("premium") === true ||
    productKey === "monthly" ||
    productKey === "yearly" ||
    productId.includes("premium") ||
    productId.includes("subscription") ||
    productId.includes("test_product")
  );
}
