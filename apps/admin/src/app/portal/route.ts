import { CustomerPortal } from "@polar-sh/nextjs";
import { NextRequest, NextResponse } from "next/server";
import {
  getAppUrl,
  getBillingProvider,
  getDodoClient,
} from "@/lib/billing/server";

/**
 * Unified customer portal entry point. Clients always hit
 *   /portal?userId=<platformCustomerId>
 * (the `userId` param name is kept for backwards compatibility — it carries
 * the provider's customer ID) and are redirected to whichever provider is
 * active (BILLING_PROVIDER).
 */

type PolarPortalHandler = (req: NextRequest) => Promise<Response>;

let polarPortalHandler: PolarPortalHandler | null = null;

function getPolarPortalHandler(): PolarPortalHandler {
  if (!polarPortalHandler) {
    polarPortalHandler = CustomerPortal({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      getCustomerId: async (req: NextRequest) => {
        const userId = req.nextUrl.searchParams.get("userId");
        if (!userId) {
          throw new Error("Customer ID is required");
        }
        return userId;
      },
      returnUrl: `${getAppUrl()}/dashboard`,
      environment:
        process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
    });
  }
  return polarPortalHandler;
}

async function handleDodoPortal(req: NextRequest): Promise<Response> {
  const customerId = req.nextUrl.searchParams.get("userId");

  if (!customerId) {
    return NextResponse.json(
      { error: "Customer ID is required" },
      { status: 400 },
    );
  }

  try {
    const client = getDodoClient();
    const session = await client.customers.customerPortal.create(customerId, {
      send_email: false,
      return_url: `${getAppUrl()}/dashboard`,
    });

    return NextResponse.redirect(session.link, 303);
  } catch (error) {
    console.error("Error creating Dodo customer portal session:", error);
    return NextResponse.json(
      { error: "Failed to open customer portal" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest): Promise<Response> {
  if (getBillingProvider() === "dodo") {
    return handleDodoPortal(req);
  }
  return getPolarPortalHandler()(req);
}
