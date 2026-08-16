import { NextResponse } from "next/server";
import { api as polarApi } from "@/lib/polar-client";
import { fetchAction, api } from "@/lib/convex-client";
import { getServerPaymentProvider } from "@/lib/payment-provider";
import { mapPolarProductToCatalog } from "@/lib/billing-catalog";

export async function GET() {
  try {
    if (getServerPaymentProvider() === "dodo") {
      const products = await fetchAction(api.features.payments.actions.listProducts, {
        recurring: false,
      });
      return NextResponse.json(products);
    }

    const response = await polarApi.products.list({
      organizationId: process.env.POLAR_ORGANIZATION_ID!,
      isRecurring: false,
    });

    const products = (response.result?.items ?? []).map(mapPolarProductToCatalog);
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching credit products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
