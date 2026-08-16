import { DodoPayments } from "@dodopayments/convex";
import { components, internal } from "./_generated/api";
import { getDodoEnvironment } from "./lib/paymentProvider";

export const dodo: DodoPayments = new DodoPayments(components.dodopayments, {
  identify: async (
    ctx,
  ): Promise<{ dodoCustomerId: string } | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const customerId: string | null = await ctx.runQuery(
      internal.features.subscriptions.queries.getDodoCustomerIdForUser,
      { userId: identity.subject },
    );

    if (!customerId) {
      return null;
    }

    return { dodoCustomerId: customerId };
  },
  apiKey: process.env.DODO_PAYMENTS_API_KEY ?? "",
  environment: getDodoEnvironment(),
});

export const { checkout, customerPortal } = dodo.api();
