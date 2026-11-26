"use client";

import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";
import { customerGrowth } from "./dashboard-data";
import { PeriodSelect } from "./period-select";

const flags: Record<string, CSSProperties> = {
  US: {
    background:
      "linear-gradient(90deg, #2A3D8F 0 38%, transparent 38%), repeating-linear-gradient(180deg, #D92D36 0 1.6px, #fff 1.6px 3.2px)",
  },
  DE: { background: "linear-gradient(180deg, #1F1F1F 0 33.3%, #D92D36 33.3% 66.6%, #F5C518 66.6%)" },
  AU: {
    background:
      "radial-gradient(circle at 68% 42%, #fff 0 9%, transparent 10%), radial-gradient(circle at 32% 70%, #fff 0 6%, transparent 7%), #1F3A93",
  },
  FR: { background: "linear-gradient(90deg, #2A3D8F 0 33.3%, #fff 33.3% 66.6%, #D92D36 66.6%)" },
};

function Flag({ code }: { code: string }) {
  return (
    <span
      aria-hidden="true"
      className="h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10"
      style={flags[code]}
    />
  );
}

export function CustomerGrowth() {
  return (
    <section className="surface flex flex-1 flex-col rounded-3xl p-5 sm:p-6">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-[19px] font-bold tracking-[-0.03em]">Customer Growth</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Track customer by locations</p>
        </div>
        <PeriodSelect label="Customer growth time range" />
      </header>

      <div className="mt-5 grid flex-1 items-center gap-5 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
        <div className="relative mx-auto h-[170px] w-full max-w-[210px]" aria-hidden="true">
          {customerGrowth.bubbles.map((bubble) => (
            <span
              key={bubble.key}
              className={cn(
                "absolute flex items-center justify-center rounded-full font-bold tracking-[-0.02em] tabular-nums backdrop-blur-[2px]",
                bubble.value.length > 4 ? "text-[14px]" : "text-[12px]",
                bubble.className
              )}
            >
              {bubble.value}
            </span>
          ))}
        </div>

        <ul className="grid gap-3">
          {customerGrowth.countries.map((country) => (
            <li key={country.code} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
              <Flag code={country.code} />
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold">{country.name}</p>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-brand" style={{ width: `${country.share * 100}%` }} />
                </div>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground tabular-nums">
                {country.value.toLocaleString("en-US")}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
