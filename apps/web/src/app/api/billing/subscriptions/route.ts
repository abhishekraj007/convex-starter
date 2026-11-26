import { NextResponse } from "next/server";
import { listBillingProducts } from "@/lib/billing/server";

/**
 * Recurring subscription products, normalized into the shared billing shape
 * regardless of the active provider (BILLING_PROVIDER).
 */
export async function GET() {
  try {
    const products = await listBillingProducts("recurring");
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching billing subscription products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
