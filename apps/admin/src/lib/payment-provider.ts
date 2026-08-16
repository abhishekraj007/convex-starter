export type WebPaymentProvider = "polar" | "dodo";

export function getClientPaymentProvider(): WebPaymentProvider {
  const value = (
    process.env.NEXT_PUBLIC_PAYMENT_PROVIDER ??
    process.env.PAYMENT_PROVIDER ??
    "polar"
  )
    .trim()
    .toLowerCase();

  return value === "dodo" ? "dodo" : "polar";
}

export function getServerPaymentProvider(): WebPaymentProvider {
  return getClientPaymentProvider();
}

export function getBillingPlatformLabel(platform: string): string {
  return platform === "revenuecat" ? "Mobile" : "Web";
}
