import { POLAR_PRICES } from "@/app/contstants/pricing";
import type { PricingCardTier } from "./pricing-cards";

const copy: Record<string, Pick<PricingCardTier, "description" | "badge" | "note">> = {
  free: { description: "For trying the starter and side projects.", note: "No card required" },
  monthly: { description: "For products with paying users.", badge: "Flexible" },
  yearly: { description: "Everything in Pro, two months free.", badge: "Best value" },
};

/** Static plans from the local pricing constants; the fallback whenever Polar data is loading or unavailable. */
export function staticPricingTiers(): PricingCardTier[] {
  const order = ["free", "monthly", "yearly"];
  return order
    .map((id) => POLAR_PRICES.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({
      id: p.id,
      name: p.id === "free" ? "Hobby" : p.id === "monthly" ? "Pro" : "Pro Yearly",
      description: copy[p.id]?.description ?? p.description,
      price: p.price ?? 0,
      frequency: p.frequency ?? "/month",
      note: p.id === "yearly" ? `$${((p.price ?? 0) / 12).toFixed(2)}/mo billed annually` : copy[p.id]?.note,
      features: p.features,
      featured: p.id === "yearly",
      badge: copy[p.id]?.badge,
    }));
}
