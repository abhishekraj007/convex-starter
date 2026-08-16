import { v } from "convex/values";
import { action } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { authComponent } from "../../lib/betterAuth";
import { checkout, customerPortal } from "../../dodo";
import { listDodoProducts } from "../../lib/dodoCatalog";
import { getWebPaymentProvider } from "../../lib/paymentProvider";
import { catalogProductValidator } from "../../lib/subscriptionValidators";
import type { CatalogProduct } from "../../lib/dodoMapping";

function requireDodoProvider(): void {
  if (getWebPaymentProvider() !== "dodo") {
    throw new Error("Dodo is not the active payment provider");
  }
}

function requireDodoApiKey(): void {
  if (!process.env.DODO_PAYMENTS_API_KEY) {
    throw new Error("DODO_PAYMENTS_API_KEY is not configured");
  }
}

export const listProducts = action({
  args: {
    recurring: v.boolean(),
  },
  returns: v.array(catalogProductValidator),
  handler: async (_ctx, args): Promise<CatalogProduct[]> => {
    requireDodoProvider();
    return await listDodoProducts(args.recurring);
  },
});

export const createCheckout = action({
  args: {
    productId: v.string(),
    returnUrl: v.optional(v.string()),
  },
  returns: v.object({
    checkout_url: v.string(),
  }),
  handler: async (ctx, args): Promise<{ checkout_url: string }> => {
    requireDodoProvider();
    requireDodoApiKey();

    const user = await authComponent.getAuthUser(ctx);
    const existingCustomerId: string | null = await ctx.runQuery(
      internal.features.subscriptions.queries.getDodoCustomerIdForUser,
      { userId: user._id },
    );

    const siteUrl =
      process.env.SITE_URL ??
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3004";
    const returnUrl = args.returnUrl ?? `${siteUrl.replace(/\/$/, "")}/success`;

    const session: { checkout_url: string } = await checkout(ctx, {
      payload: {
        product_cart: [{ product_id: args.productId, quantity: 1 }],
        return_url: returnUrl,
        billing_currency: "USD",
        metadata: {
          userId: user._id,
        },
        customer: existingCustomerId
          ? { customer_id: existingCustomerId }
          : {
              email: user.email,
              name: user.name,
            },
        feature_flags: {
          allow_discount_code: true,
        },
      },
    });

    if (!session.checkout_url) {
      throw new Error("Checkout session did not return a checkout_url");
    }

    return { checkout_url: session.checkout_url };
  },
});

export const getCustomerPortal = action({
  args: {
    sendEmail: v.optional(v.boolean()),
  },
  returns: v.object({
    portal_url: v.string(),
  }),
  handler: async (ctx, args): Promise<{ portal_url: string }> => {
    requireDodoProvider();
    requireDodoApiKey();
    await authComponent.getAuthUser(ctx);

    const portal: { portal_url: string } = await customerPortal(ctx, {
      send_email: args.sendEmail ?? false,
    });

    if (!portal.portal_url) {
      throw new Error("Customer portal did not return a portal_url");
    }

    return { portal_url: portal.portal_url };
  },
});
