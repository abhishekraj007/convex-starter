import { describe, expect, test } from "vitest";
import {
  getRevenueCatProductKey,
  isRevenueCatSubscriptionProduct,
} from "../convex/lib/revenuecatProducts";

describe("RevenueCat product classification", () => {
  test("classifies monthly and yearly products as subscriptions", () => {
    expect(
      isRevenueCatSubscriptionProduct({ product_id: "monthly" }),
    ).toBe(true);
    expect(
      isRevenueCatSubscriptionProduct({ product_id: "yearly" }),
    ).toBe(true);
  });

  test("classifies an expiring transaction as a subscription", () => {
    expect(
      isRevenueCatSubscriptionProduct({
        product_id: "com.app.pro",
        expiration_at_ms: 1_800_000_000_000,
      }),
    ).toBe(true);
  });

  test("does not classify configured credit products as subscriptions", () => {
    expect(
      isRevenueCatSubscriptionProduct({ product_id: "credits_1000" }),
    ).toBe(false);
  });

  test("maps subscription and credit product keys", () => {
    expect(getRevenueCatProductKey("monthly")).toBe("monthly");
    expect(getRevenueCatProductKey("yearly")).toBe("yearly");
    expect(getRevenueCatProductKey("credits_1000")).toBe("credits1000");
  });
});
