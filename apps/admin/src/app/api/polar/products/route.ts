import { NextResponse } from "next/server";
import { api } from "@/lib/polar-client";

export async function GET() {
  try {
    // Fetch all products from Polar
    const products = await api.products.list({
      organization_id: process.env.POLAR_ORGANIZATION_ID!,
      is_recurring: false, // Get one-time purchase products (credits)
    });

    return NextResponse.json(products.items);
  } catch (error) {
    console.error("Error fetching Polar products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
