/**
 * Shared billing types consumed by the pricing UI.
 * Every payment provider normalizes its catalog into this shape, so pricing
 * cards, modals and checkout links never need to know which provider is active.
 */

export type BillingProvider = "polar" | "dodo";

export interface BillingProductPrice {
  type?: string;
  /** Amount in the smallest currency unit (cents for USD) for all providers. */
  priceAmount: number;
  priceCurrency: string;
  /** Lowercase interval ("month" | "year" | ...) for recurring prices. */
  recurringInterval?: string;
}

export interface BillingProduct {
  id: string;
  name: string;
  description?: string;
  prices?: BillingProductPrice[];
  metadata?: {
    credits?: string;
    /** Legacy typo kept for backwards compatibility with existing data. */
    credtis?: string;
  };
}

export interface BillingConfig {
  provider: BillingProvider;
  /** Whether the provider supports an embedded overlay checkout. */
  embedEnabled: boolean;
}
