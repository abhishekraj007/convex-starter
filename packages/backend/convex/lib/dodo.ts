import {
  DodoPayments,
  type DodoPaymentsClientConfig,
} from "@dodopayments/convex";
import { components, internal } from "../_generated/api";

/**
 * Dodo Payments component client.
 *
 * The web app creates checkout sessions and customer portal sessions through
 * its own Next.js routes (so the client-facing URL contract stays identical
 * across billing providers). This client is wired for completeness so the
 * component API can be used from Convex actions (e.g. native app flows),
 * and the webhook handler is registered in convex/http.ts.
 */
export const dodo = new DodoPayments(components.dodopayments, {
  // Maps the signed-in Convex user to their Dodo Payments customer ID.
  // The customer ID is denormalized onto subscription rows written by the
  // webhook handler, so no extra customers table is needed.
  identify: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const dodoCustomerId = await ctx.runQuery(
      internal.features.subscriptions.queries.getDodoCustomerIdByUserId,
      { userId: identity.subject },
    );

    if (!dodoCustomerId) {
      return null;
    }

    return { dodoCustomerId };
  },
  apiKey: process.env.DODO_PAYMENTS_API_KEY!,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT as
    | "test_mode"
    | "live_mode",
} as DodoPaymentsClientConfig);

export const { checkout, customerPortal } = dodo.api();
