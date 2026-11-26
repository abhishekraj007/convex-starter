"use client";

import Link from "next/link";
import { Check, Crown, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconTile } from "@/components/ui/icon-tile";

const perks = ["Unlimited AI credits", "5 GB encrypted storage", "Priority support"];

export function PlanCard({ isPremium }: { isPremium: boolean }) {
  if (isPremium) {
    return (
      <section className="surface flex flex-1 flex-col rounded-3xl p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <IconTile tone="brand">
            <Crown />
          </IconTile>
          <Badge variant="success">Active</Badge>
        </div>
        <h2 className="mt-5 text-[17px] font-bold tracking-[-0.025em]">Pro plan</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
          Every limit is lifted: unlimited credits, 5 GB of encrypted storage and priority support.
        </p>
        <div className="mt-auto pt-5">
          <Button variant="secondary" shape="pill" className="w-full" render={<Link href="/pricing" />}>
            Manage plan
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="promo-card relative flex flex-1 flex-col overflow-hidden rounded-3xl p-5 sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-10 size-44 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_55%,transparent),transparent)]" />
      <IconTile tone="inverse" className="relative bg-white/12 text-white">
        <Sparkles />
      </IconTile>
      <h2 className="relative mt-5 text-[17px] font-bold tracking-[-0.025em]">Upgrade to Pro</h2>
      <p className="relative mt-1 text-[12px] leading-relaxed text-promo-muted">
        Remove the limits and get the most out of your workspace.
      </p>
      <ul className="relative mt-4 grid gap-2">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-[11.5px] text-promo-muted">
            <Check className="size-3.5 shrink-0 text-promo-foreground" strokeWidth={3} />
            {perk}
          </li>
        ))}
      </ul>
      <div className="relative mt-auto pt-5">
        <Button shape="pill" className="w-full" render={<Link href="/pricing" />}>
          View plans
        </Button>
      </div>
    </section>
  );
}
