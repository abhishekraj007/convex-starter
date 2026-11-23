import * as React from "react";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type PricingCardTier = {
  id: string;
  name: string;
  description: string;
  price: number;
  frequency: string;
  note?: string;
  features: string[];
  featured?: boolean;
  badge?: string;
};

/**
 * Three plans in one joined surface: hairline dividers instead of three boxy cards,
 * the featured plan lifted with a brand-tinted top light.
 */
export function PricingCards({
  tiers,
  renderAction,
  className,
}: {
  tiers: PricingCardTier[];
  renderAction: (tier: PricingCardTier) => React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("surface grid overflow-hidden rounded-2xl md:grid-cols-3", className)}>
      {tiers.map((tier, i) => (
        <div
          key={tier.id}
          className={cn(
            "relative flex flex-col gap-6 p-7",
            i > 0 && "border-t border-border md:border-t-0 md:border-l",
            tier.featured && "bg-[radial-gradient(120%_60%_at_50%_0%,color-mix(in_oklab,var(--brand)_10%,transparent),transparent_70%)]"
          )}
        >
          {tier.featured ? (
            <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--brand),transparent)]" />
          ) : null}
          <div className="grid gap-1.5">
            <div className="flex h-6 items-center justify-between">
              <h3 className="text-[15px] font-semibold tracking-[-0.015em]">{tier.name}</h3>
              {tier.badge ? (
                <Badge variant={tier.featured ? "brand" : "default"} dot={tier.featured}>
                  {tier.badge}
                </Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">{tier.description}</p>
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-[44px] leading-none font-semibold tracking-[-0.045em] tabular-nums">
                ${Number.isInteger(tier.price) ? tier.price : tier.price.toFixed(2)}
              </span>
              <span className="text-sm text-muted-foreground">{tier.frequency}</span>
            </div>
            <p className="mt-2 h-4 text-xs text-faint-foreground">{tier.note ?? ""}</p>
          </div>
          {renderAction(tier)}
          <ul className="grid gap-2.5 border-t border-border pt-6 text-sm">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5">
                <span className={cn("mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full", tier.featured ? "bg-brand/12 text-brand-text" : "bg-muted text-muted-foreground")}>
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                <span className="text-foreground/85">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
