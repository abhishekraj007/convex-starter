import { api } from "@/lib/polar-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await api.products.list({
      organization_id: process.env.POLAR_ORGANIZATION_ID!,
      is_recurring: true,
    });

    return NextResponse.json(result.items);
  } catch (error) {
    console.error("Error fetching Polar subscription products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
