import { describe, expect, test } from "vitest";
import {
  creditsForSubscriptionCycle,
  mapDodoIntervalToPolarInterval,
  mapDodoIntervalToProductType,
  mapDodoSubscriptionStatus,
  normalizeDodoProduct,
  parseCreditAmount,
  readMetadataString,
  toEpochMs,
} from "../convex/lib/dodoMapping";

describe("Dodo subscription mapping", () => {
  test("maps pending to trialing and cancelled to canceled", () => {
    expect(mapDodoSubscriptionStatus("pending")).toBe("trialing");
    expect(mapDodoSubscriptionStatus("cancelled")).toBe("canceled");
    expect(mapDodoSubscriptionStatus("expired")).toBe("expired");
    expect(mapDodoSubscriptionStatus("on_hold")).toBe("past_due");
    expect(mapDodoSubscriptionStatus("paused")).toBe("past_due");
    expect(mapDodoSubscriptionStatus("failed")).toBe("past_due");
    expect(mapDodoSubscriptionStatus("active")).toBe("active");
  });

  test("maps an active subscription scheduled to cancel as canceled", () => {
    expect(mapDodoSubscriptionStatus("active", true)).toBe("canceled");
    expect(mapDodoSubscriptionStatus("active", false)).toBe("active");
  });

  test("maps billing intervals to product types and polar-style intervals", () => {
    expect(mapDodoIntervalToProductType("Month")).toBe("monthly");
    expect(mapDodoIntervalToProductType("Year")).toBe("yearly");
    expect(mapDodoIntervalToProductType("Week")).toBeUndefined();
    expect(mapDodoIntervalToPolarInterval("Month")).toBe("month");
    expect(mapDodoIntervalToPolarInterval("Year")).toBe("year");
  });

  test("grants yearly and monthly credit bonuses", () => {
    expect(creditsForSubscriptionCycle("Year")).toBe(5000);
    expect(creditsForSubscriptionCycle("Month")).toBe(1000);
  });
});

describe("Dodo catalog helpers", () => {
  test("parses credit amounts and metadata strings", () => {
    expect(parseCreditAmount("2500")).toBe(2500);
    expect(parseCreditAmount(100)).toBe(100);
    expect(parseCreditAmount("nope")).toBe(0);
    expect(readMetadataString({ userId: "user_1" }, "userId")).toBe("user_1");
    expect(readMetadataString(null, "userId")).toBeUndefined();
  });

  test("normalizes recurring and one-time products", () => {
    const recurring = normalizeDodoProduct({
      product_id: "prod_month",
      name: "Monthly Pro",
      description: "Monthly plan",
      is_recurring: true,
      price_detail: {
        type: "recurring_price",
        payment_frequency_interval: "Month",
        price: 1500,
        currency: "USD",
      },
    });

    expect(recurring).toEqual({
      id: "prod_month",
      name: "Monthly Pro",
      description: "Monthly plan",
      prices: [
        {
          priceAmount: 1500,
          priceCurrency: "USD",
          recurringInterval: "month",
        },
      ],
      metadata: undefined,
    });

    const credits = normalizeDodoProduct({
      product_id: "prod_credits",
      name: "2500 Credits",
      is_recurring: false,
      price: 1999,
      currency: "USD",
      metadata: { credits: "2500" },
    });

    expect(credits.metadata).toEqual({ credits: "2500" });
    expect(credits.prices[0]?.priceAmount).toBe(1999);
  });

  test("converts dates to epoch milliseconds", () => {
    expect(toEpochMs("2026-01-01T00:00:00.000Z")).toBe(
      Date.parse("2026-01-01T00:00:00.000Z"),
    );
    expect(toEpochMs(null)).toBeUndefined();
  });
});
