"use client";

import { Armchair, Gamepad2, Lightbulb } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { IconTile } from "@/components/ui/icon-tile";
import { productStatistic } from "./dashboard-data";
import { PeriodSelect } from "./period-select";

const categoryIcons = { electronic: Lightbulb, games: Gamepad2, furniture: Armchair } as const;

const SIZE = 200;
const CENTER = SIZE / 2;
const START = 135;
const SWEEP = 270;

function polar(angle: number, radius: number) {
  const rad = (angle * Math.PI) / 180;
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) };
}

function arcPath(radius: number, fraction: number) {
  const end = START + SWEEP * fraction;
  const from = polar(START, radius);
  const to = polar(end, radius);
  return `M ${from.x} ${from.y} A ${radius} ${radius} 0 ${SWEEP * fraction > 180 ? 1 : 0} 1 ${to.x} ${to.y}`;
}

const rings = [
  { radius: 78, color: "var(--brand)" },
  { radius: 61, color: "var(--chart-2)" },
  { radius: 44, color: "var(--destructive)" },
  { radius: 27, color: "var(--chart-5)" },
];

function RadialChart() {
  const track = "color-mix(in oklab, var(--foreground) 8%, var(--card))";
  return (
    <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="h-40 w-40 shrink-0" aria-hidden="true">
      {rings.map((ring) => (
        <path
          key={`track-${ring.radius}`}
          d={arcPath(ring.radius, 1)}
          fill="none"
          stroke={track}
          strokeWidth={11}
          strokeLinecap="round"
        />
      ))}
      {rings.map((ring, i) => (
        <path
          key={`arc-${ring.radius}`}
          d={arcPath(ring.radius, productStatistic.rings[i])}
          fill="none"
          stroke={ring.color}
          strokeWidth={11}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function ProductStatistic() {
  return (
    <section className="surface rounded-3xl p-5 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-[19px] font-bold tracking-[-0.03em]">Product Statistic</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Track your product sales</p>
        </div>
        <PeriodSelect label="Product statistic time range" />
      </header>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <RadialChart />
        <div className="min-w-24 text-right">
          <p className="stat-figure text-[clamp(1.8rem,3vw,2.2rem)]">{productStatistic.total}</p>
          <p className="mt-1 text-[11.5px] text-muted-foreground">{productStatistic.label}</p>
          <Badge variant="success" className="mt-2.5 text-[10.5px]">
            +{productStatistic.delta.toFixed(2)}%
          </Badge>
        </div>
      </div>

      <ul className="mt-5 grid gap-1">
        {productStatistic.categories.map((category) => {
          const Icon = categoryIcons[category.key as keyof typeof categoryIcons];
          const positive = category.delta >= 0;
          return (
            <li key={category.key} className="flex items-center gap-3 rounded-xl px-1 py-2">
              <IconTile tone="muted" size="sm" className="rounded-lg">
                <Icon />
              </IconTile>
              <span className="flex-1 text-[12.5px] font-medium">{category.label}</span>
              <span className="stat-figure text-[13px] tracking-[-0.02em]">{category.value}</span>
              <Badge
                variant={positive ? "success" : "destructive"}
                className="h-6 min-w-14 justify-center px-2 text-[11px] font-bold"
              >
                {positive ? "+" : "−"}
                {Math.abs(category.delta).toFixed(2).replace(/\.?0+$/, "")}%
              </Badge>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
