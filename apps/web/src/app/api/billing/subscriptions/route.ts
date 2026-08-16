import { NextResponse } from "next/server";
import { api as polarApi } from "@/lib/polar-client";
import { fetchAction, api } from "@/lib/convex-client";
import { getServerPaymentProvider } from "@/lib/payment-provider";
import { mapPolarProductToCatalog } from "@/lib/billing-catalog";

export async function GET() {
  try {
    if (getServerPaymentProvider() === "dodo") {
      const products = await fetchAction(api.features.payments.actions.listProducts, {
        recurring: true,
      });
      return NextResponse.json(products);
    }

    const result = await polarApi.products.list({
      organizationId: process.env.POLAR_ORGANIZATION_ID!,
      isRecurring: true,
    });

    const products = (result.result?.items ?? []).map(mapPolarProductToCatalog);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching subscription products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
