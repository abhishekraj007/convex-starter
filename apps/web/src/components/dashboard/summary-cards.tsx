"use client";

import { ClipboardList, Package, ReceiptText, UserRound } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { IconTile } from "@/components/ui/icon-tile";
import { summaryCards } from "./dashboard-data";

const icons = {
  sales: ReceiptText,
  orders: ClipboardList,
  visitors: UserRound,
  products: Package,
} as const;

function DeltaBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <Badge variant={positive ? "success" : "destructive"} className="h-6 px-2.5 text-[11px] font-bold">
      {positive ? "+" : "−"}
      {Math.abs(value).toFixed(2).replace(/\.?0+$/, "")}%
    </Badge>
  );
}

export function SummaryCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {summaryCards.map((card) => {
        const Icon = icons[card.key];
        if (card.hero) {
          return (
            <div
              key={card.key}
              className="relative overflow-hidden rounded-3xl bg-primary p-5 text-primary-foreground shadow-[0_18px_40px_-24px_color-mix(in_oklab,var(--brand)_85%,transparent)] sm:p-6"
            >
              <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-10 size-46 rounded-full bg-white/10 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <IconTile tone="inverse" className="bg-white/16 text-white"><Icon /></IconTile>
                <DeltaBadge value={card.delta} />
              </div>
              <p className="relative mt-7 text-[12.5px] font-semibold text-white/90">{card.label}</p>
              <div className="relative mt-1 flex items-end gap-3">
                <p className="stat-figure text-[clamp(2rem,4.4vw,2.6rem)]">{card.value}</p>
                <p className="mb-1.5 max-w-24 text-[11px] leading-[1.35] text-white/90">{card.caption}</p>
              </div>
            </div>
          );
        }

        return (
          <div key={card.key} className="surface flex flex-col rounded-3xl p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <IconTile tone="muted"><Icon /></IconTile>
              <DeltaBadge value={card.delta} />
            </div>
            <p className="mt-6 text-[12.5px] font-semibold text-muted-foreground">{card.label}</p>
            <div className="mt-1 flex items-end gap-3">
              <p className="stat-figure text-[clamp(1.8rem,4vw,2.35rem)] text-foreground">{card.value}</p>
              <p className="mb-1 max-w-26 text-[11px] leading-[1.35] text-muted-foreground">{card.caption}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
