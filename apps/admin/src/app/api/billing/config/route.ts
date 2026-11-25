import { NextResponse } from "next/server";
import { getBillingProvider } from "@/lib/billing/server";
import type { BillingConfig } from "@/lib/billing/types";

/**
 * Public billing capabilities for the client. Used to decide whether the
 * embedded overlay checkout is available (Polar) or checkout must always
 * redirect to the hosted page (Dodo). No secrets are exposed.
 */
export async function GET() {
  const provider = getBillingProvider();

  const config: BillingConfig = {
    provider,
    embedEnabled: provider === "polar",
  };

  return NextResponse.json(config);
}
