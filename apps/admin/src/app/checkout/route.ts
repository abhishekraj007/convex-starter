// src/app/checkout/route.ts
import { Checkout } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";
import {
  getAppUrl,
  getBillingProvider,
  getDodoClient,
} from "@/lib/billing/server";

/**
 * Unified checkout entry point. Clients always hit
 *   /checkout?products=<id>&customerExternalId=<userId>&customerEmail=<email>&customerName=<name>
 * and are redirected to the hosted checkout of whichever provider is active
 * (BILLING_PROVIDER), so the client never needs to know the difference.
 */

type PolarCheckoutHandler = (req: NextRequest) => Promise<Response>;

let polarCheckoutHandler: PolarCheckoutHandler | null = null;

function getPolarCheckoutHandler(): PolarCheckoutHandler {
  if (!polarCheckoutHandler) {
    polarCheckoutHandler = Checkout({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      returnUrl: `${getAppUrl()}/dashboard`,
      successUrl: `${getAppUrl()}/dashboard?checkout_id={CHECKOUT_ID}`,
      environment:
        process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
    });
  }
  return polarCheckoutHandler;
}

function getProductIds(req: NextRequest): string[] {
  return req.nextUrl.searchParams
    .getAll("products")
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

async function handleDodoCheckout(req: NextRequest): Promise<Response> {
  const productIds = getProductIds(req);

  if (productIds.length === 0) {
    return NextResponse.json(
      { error: "Missing products parameter" },
      { status: 400 },
    );
  }

  const customerExternalId = req.nextUrl.searchParams.get("customerExternalId");
  const customerEmail = req.nextUrl.searchParams.get("customerEmail");
  const customerName = req.nextUrl.searchParams.get("customerName");

  try {
    const client = getDodoClient();
    const session = await client.checkoutSessions.create({
      product_cart: productIds.map((productId) => ({
        product_id: productId,
        quantity: 1,
      })),
      customer: customerEmail
        ? {
            email: customerEmail,
            name: customerName || undefined,
          }
        : undefined,
      return_url: `${getAppUrl()}/dashboard`,
      // userId links the payment/subscription back to the Better Auth user
      // in webhook processing. Dodo propagates session metadata to the
      // resulting payment and subscription objects.
      metadata: customerExternalId ? { userId: customerExternalId } : undefined,
      feature_flags: {
        allow_discount_code: true,
      },
    });

    if (!session.checkout_url) {
      throw new Error("Checkout session did not return a checkout_url");
    }

    return NextResponse.redirect(session.checkout_url, 303);
  } catch (error) {
    console.error("Error creating Dodo checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  if (getBillingProvider() === "dodo") {
    return handleDodoCheckout(req);
  }
  return getPolarCheckoutHandler()(req);
}
