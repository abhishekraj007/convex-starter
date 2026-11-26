"use client";

import { useQuery as useConvexQuery } from "convex/react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@convex-starter/backend/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Undo2, Zap } from "lucide-react";
import { PricingCards, type PricingCardTier } from "@/components/marketing/pricing-cards";
import { staticPricingTiers } from "@/components/marketing/pricing-data";
import { LoginModal } from "@/components/login-modal";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function PricingPage() {
  const router = useRouter();

  const userData = useConvexQuery(api.user.fetchUserAndProfile);
  const userSubscriptions = useConvexQuery(
    api.features.subscriptions.queries.getUserSubscriptions
  );
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Fetch subscription products using react-query for caching
  const { data: subscriptionProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ["billing-subscriptions"],
    queryFn: async () => {
      const response = await fetch("/api/billing/subscriptions");
      if (!response.ok) {
        throw new Error("Failed to fetch subscription products");
      }
      return response.json() as Promise<
        Array<{
          id: string;
          name: string;
          description?: string;
          prices?: Array<{
            type: string;
            priceAmount: number;
            priceCurrency: string;
            recurringInterval?: string;
          }>;
        }>
      >;
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Never block the page on data: plans render from local constants and are
  // upgraded in place once live products arrive.
  const isLoading = productsLoading;
  const isAuthenticated = userData !== null && userData !== undefined;

  const customerId = userSubscriptions?.subscriptions?.[0]?.platformCustomerId;

  const handleCheckout = (productId: string | undefined) => {
    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }

    if (!productId) return;

    setCheckoutLoading(productId);

    const userId = userData!.profile?.authUserId || "";
    const userEmail = userData!.userMetadata.email || "";
    const userName = userData!.profile?.name || userData!.userMetadata.name;

    const params = new URLSearchParams({
      products: productId,
      customerEmail: userEmail,
      customerExternalId: userId,
      customerName: userName,
    });

    const url = `/checkout?${params.toString()}` as any;
    router.push(url);
  };

  const goToPortal = async () => {
    // find the customer id associated with this user
    if (!customerId) {
      console.error("No customer ID found");
      return;
    }
    router.push(`/portal?userId=${customerId}` as any);
  };

  const hasActiveSubscription = userSubscriptions?.hasActiveSubscription || false;
  const hasAnySubscription = !!userSubscriptions?.subscriptions?.find(
    (sub) => sub.status === "active" || sub.status === "canceled"
  );

  const monthlyProduct = subscriptionProducts.find((p) => p.prices?.some((price) => price.recurringInterval === "month"));
  const yearlyProduct = subscriptionProducts.find((p) => p.prices?.some((price) => price.recurringInterval === "year"));
  const priceOf = (product: typeof monthlyProduct, interval: string) =>
    (product?.prices?.find((p) => p.recurringInterval === interval)?.priceAmount || 0) / 100;

  const productIds: Record<string, string | undefined> = {
    monthly: monthlyProduct?.id,
    yearly: yearlyProduct?.id,
  };

  const tiers: PricingCardTier[] = staticPricingTiers().map((tier) => {
    if (tier.id === "monthly" && monthlyProduct) {
      return { ...tier, name: monthlyProduct.name || tier.name, price: priceOf(monthlyProduct, "month") };
    }
    if (tier.id === "yearly" && yearlyProduct) {
      const price = priceOf(yearlyProduct, "year");
      return { ...tier, name: yearlyProduct.name || tier.name, price, note: `$${(price / 12).toFixed(2)}/mo billed annually` };
    }
    return tier;
  });

  const renderAction = (tier: PricingCardTier) => {
    const variant = tier.featured ? "default" : "secondary";
    if (tier.id === "free") {
      return (
        <Button className="w-full" variant="secondary" disabled>
          {isAuthenticated && !hasActiveSubscription ? "Current plan" : "Free forever"}
        </Button>
      );
    }
    if (!isAuthenticated) {
      return (
        <Button className="w-full" variant={variant} onClick={() => setLoginModalOpen(true)}>
          Get started
        </Button>
      );
    }
    if (hasAnySubscription) {
      return (
        <Button className="w-full" variant={variant} onClick={goToPortal}>
          Manage subscription
        </Button>
      );
    }
    const productId = productIds[tier.id];
    return (
      <Button
        className="w-full"
        variant={variant}
        onClick={() => handleCheckout(productId)}
        disabled={isLoading || !productId || checkoutLoading === productId}
      >
        {checkoutLoading === productId ? "Redirecting…" : `Upgrade to ${tier.name}`}
      </Button>
    );
  };

  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-grid [mask-image:radial-gradient(60%_70%_at_50%_0%,black,transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-[-180px] left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_16%,transparent),transparent)]" />
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-24">
        <div className="max-w-3xl">
          <p className="eyebrow">Pricing</p>
          <h1 className="mt-3 text-[3rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance">
            Start free. <span className="text-muted-foreground">Upgrade when it earns.</span>
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
            Every plan includes the full starter: auth, realtime data, storage and the design system. Pro unlocks unlimited credits and priority support.
          </p>
        </div>

        <PricingCards className="mt-12" tiers={tiers} renderAction={renderAction} />

        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-3">
          {[
            { icon: Undo2, title: "14-day money-back", body: "Not a fit? Get a full refund, no questions." },
            { icon: ShieldCheck, title: "Secure checkout", body: "Payments and invoices handled by a PCI-compliant provider." },
            { icon: Zap, title: "Cancel anytime", body: "Manage or cancel from the customer portal." },
          ].map((item) => (
            <div key={item.title} className="flex gap-3 bg-background p-5">
              <item.icon className="mt-0.5 size-4 shrink-0 text-faint-foreground" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} returnUrl="/pricing" />
    </div>
  );
}
