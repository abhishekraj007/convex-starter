import { NextResponse } from "next/server";
import { listBillingProducts } from "@/lib/billing/server";

/**
 * One-time purchase products (credit packs), normalized into the shared
 * billing shape regardless of the active provider (BILLING_PROVIDER).
 */
export async function GET() {
  try {
    const products = await listBillingProducts("one_time");
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching billing products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
