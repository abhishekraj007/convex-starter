export type WebPaymentProvider = "polar" | "dodo";
export type SubscriptionPlatform = WebPaymentProvider | "revenuecat";

export function getWebPaymentProvider(): WebPaymentProvider {
  const value = process.env.PAYMENT_PROVIDER?.trim().toLowerCase();
  if (value === "dodo") {
    return "dodo";
  }
  return "polar";
}

export function isWebPaymentPlatform(
  platform: SubscriptionPlatform,
): platform is WebPaymentProvider {
  return platform === "polar" || platform === "dodo";
}

export function getDodoApiBaseUrl(): string {
  return process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
    ? "https://live.dodopayments.com"
    : "https://test.dodopayments.com";
}

export function getDodoEnvironment(): "test_mode" | "live_mode" {
  return process.env.DODO_PAYMENTS_ENVIRONMENT === "live_mode"
    ? "live_mode"
    : "test_mode";
}
