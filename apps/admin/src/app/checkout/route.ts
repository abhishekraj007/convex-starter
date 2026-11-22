// src/app/checkout/route.ts
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3015"}/dashboard`,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3015"}/dashboard?checkout_id={CHECKOUT_ID}`,
  environment:
    process.env.POLAR_SERVER === "production" ? "production" : "sandbox",
});
