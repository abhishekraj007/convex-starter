"use client";

import { customerHabits } from "./dashboard-data";
import { PeriodSelect } from "./period-select";

const levels = [60, 50, 40, 30, 20, 10, 0];

function pct(value: number) {
  return `${(value / customerHabits.max) * 100}%`;
}

export function CustomerHabits() {
  return (
    <section className="surface rounded-3xl p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-[19px] font-bold tracking-[-0.03em]">Customer Habits</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Track your customer habits</p>
        </div>
        <PeriodSelect label="Customer habits time range" defaultValue="year" items={[{ value: "year", label: "This year" }, { value: "last", label: "Last year" }]} />
      </header>

      <div className="mt-5 flex items-center gap-5 text-[11.5px] text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-[color-mix(in_oklab,var(--foreground)_18%,var(--card))]" />
          Seen product
        </span>
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
          Sales
        </span>
      </div>

      <div className="mt-4 flex gap-2.5 sm:gap-4">
        <div className="flex h-[220px] w-7 shrink-0 flex-col justify-between py-px text-right text-[10.5px] text-faint-foreground tabular-nums">
          {levels.map((level) => (
            <span key={level} className="-translate-y-1/2">{level}K</span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="absolute inset-x-0 top-0 h-[220px]" aria-hidden="true">
            {levels.map((level) => (
              <span
                key={level}
                className="absolute inset-x-0 border-t border-dashed border-border"
                style={{ bottom: pct(level) }}
              />
            ))}
          </div>

          <div
            role="img"
            aria-label="Seen products compared with sales from January to July"
            className="relative grid h-[220px] grid-cols-7 items-end gap-1.5 sm:gap-3"
          >
            {customerHabits.months.map((month, i) => (
              <div key={month} className="relative flex h-full items-end justify-center gap-1 sm:gap-1.5">
                {month === customerHabits.tooltip.month ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute left-[37%] z-10 size-2 -translate-x-1/2 rounded-full bg-foreground ring-2 ring-card"
                      style={{ bottom: pct(customerHabits.seen[i]) }}
                    />
                    <div
                      className="pointer-events-none absolute left-1/2 z-20 hidden w-44 -translate-x-1/2 rounded-2xl bg-promo px-3.5 py-3 text-promo-foreground shadow-[var(--elev-3)] ring-1 ring-promo-border sm:block"
                      style={{ bottom: `calc(${pct(customerHabits.seen[i])} + 16px)` }}
                    >
                      <div className="grid gap-2">
                        <div className="flex items-center gap-2 text-[11.5px]">
                          <span aria-hidden="true" className="size-2 rounded-full bg-white/40" />
                          <span className="font-bold tabular-nums">{customerHabits.tooltip.seen}</span>
                          <span className="text-promo-muted">Products</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11.5px]">
                          <span aria-hidden="true" className="size-2 rounded-full bg-brand" />
                          <span className="font-bold tabular-nums">{customerHabits.tooltip.sales}</span>
                          <span className="text-promo-muted">Products</span>
                        </div>
                      </div>
                      <span aria-hidden="true" className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 bg-promo" />
                    </div>
                  </>
                ) : null}
                <span
                  className="w-3 rounded-t-full bg-[color-mix(in_oklab,var(--foreground)_20%,var(--card))] transition-[height] duration-500 sm:w-3.5"
                  style={{ height: pct(customerHabits.seen[i]) }}
                />
                <span
                  className="w-3 rounded-t-full bg-brand transition-[height] duration-500 sm:w-3.5"
                  style={{ height: pct(customerHabits.sales[i]) }}
                />
              </div>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1.5 sm:gap-3">
            {customerHabits.months.map((month) => (
              <span key={month} className="text-center text-[11.5px] font-medium text-muted-foreground">{month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
