import {
  Bell,
  CalendarDays,
  ChevronDown,
  CreditCard,
  Home,
  LayoutDashboard,
  Search,
  Sparkles,
  Upload,
  Users,
  Wallet,
  Zap,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

const bars = [32, 44, 38, 52, 48, 61, 58, 72, 66, 80, 76, 92];

const stats = [
  { label: "Monthly revenue", value: "$12,480", delta: "+12.4%", icon: Wallet },
  { label: "Active subscribers", value: "1,284", delta: "+8.1%", icon: Users },
  { label: "Credits used", value: "48.2k", delta: "+3.9%", icon: Zap },
];

const nav = [
  {
    label: "Workspace",
    items: [
      { icon: Home, label: "Home" },
      { icon: LayoutDashboard, label: "Dashboard", active: true },
      { icon: Sparkles, label: "AI Assistant" },
      { icon: Upload, label: "Uploads" },
    ],
  },
  {
    label: "Financial",
    items: [{ icon: CreditCard, label: "Billing" }],
  },
];

const rows = [
  { name: "Aarav Mehta", email: "aarav@lumen.dev", plan: "Pro · yearly", status: "Active", amount: "$96.00" },
  { name: "Sofia Romero", email: "sofia@northwind.io", plan: "Pro · monthly", status: "Active", amount: "$9.99" },
  { name: "Kenji Watanabe", email: "kenji@hikari.jp", plan: "Free", status: "Trial", amount: "$0.00" },
  { name: "Lena Fischer", email: "lena@atelier.de", plan: "Pro · monthly", status: "Past due", amount: "$9.99" },
];

const statusVariant = { Active: "success", Trial: "info", "Past due": "warning" } as const;

/** Static, non-interactive product shot built from the real design tokens and components. */
export function ProductPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative rounded-[28px] border border-border/70 bg-card/80 p-2 shadow-[var(--elev-4)] backdrop-blur-sm",
        className
      )}
      aria-hidden="true"
    >
      <div className="overflow-hidden rounded-[22px] border border-border/70 bg-background">
        {/* window chrome */}
        <div className="flex h-10 items-center gap-3 border-b border-border/70 bg-card px-4">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-destructive" />
            <span className="size-2.5 rounded-full bg-warning" />
            <span className="size-2.5 rounded-full bg-success" />
          </div>
          <div className="mx-auto flex h-6 w-40 min-w-0 items-center justify-center gap-1.5 rounded-full border border-border bg-card px-3 font-mono text-[10px] text-muted-foreground sm:w-64 sm:text-[10.5px]">
            <span className="truncate">app.convex-starter.dev/dashboard</span>
          </div>
          <div className="w-12" />
        </div>

        <div className="flex gap-2.5 p-2.5">
          {/* floating sidebar */}
          <aside className="hidden w-[212px] shrink-0 flex-col rounded-2xl border border-sidebar-border/70 bg-sidebar p-3 shadow-[var(--elev-1)] md:flex">
            <div className="flex items-center gap-2 px-0.5">
              <BrandMark className="size-6" />
              <span className="min-w-0 flex-1 truncate text-[12px] font-bold tracking-[-0.015em]">Acme Studio</span>
              <ChevronDown className="size-3.5 shrink-0 text-faint-foreground" />
            </div>

            <div className="mt-3 flex h-8 items-center gap-2 rounded-xl bg-muted/70 px-2.5 text-[11px] text-faint-foreground">
              <Search className="size-3.5" />
              Search
              <Kbd className="ml-auto h-4 border-0 bg-card/70 text-[9px]">⌘K</Kbd>
            </div>

            {nav.map((group) => (
              <div key={group.label} className="mt-3 grid gap-1">
                <p className="px-2.5 text-[8px] font-semibold tracking-[0.14em] text-faint-foreground uppercase">
                  {group.label}
                </p>
                {group.items.map(({ icon: Icon, label, active }) => (
                  <div
                    key={label}
                    className={cn(
                      "flex h-8 items-center gap-2.5 rounded-xl px-2.5 text-[11.5px] font-medium text-sidebar-foreground",
                      active && "bg-brand font-semibold text-brand-foreground shadow-[0_6px_14px_-8px_color-mix(in_oklab,var(--brand)_80%,transparent)]"
                    )}
                  >
                    <Icon className={cn("size-3.5 shrink-0", active ? "text-brand-foreground" : "text-faint-foreground")} />
                    {label}
                  </div>
                ))}
              </div>
            ))}

            <div className="promo-card mt-auto relative overflow-hidden rounded-xl p-2.5">
              <div aria-hidden="true" className="absolute -top-6 -right-4 size-16 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_55%,transparent),transparent)]" />
              <div className="relative flex items-center gap-1.5">
                <span className="flex size-5 items-center justify-center rounded-md bg-white/12 text-white">
                  <Sparkles className="size-3" />
                </span>
                <span className="text-[10.5px] font-bold tracking-[-0.01em]">Upgrade Pro</span>
              </div>
              <p className="relative mt-1 text-[8.5px] leading-relaxed text-promo-muted">Unlock unlimited credits and priority support.</p>
              <span className="relative mt-2 block h-6 rounded-full bg-primary text-center text-[9.5px] leading-6 font-semibold text-primary-foreground">
                Upgrade now
              </span>
            </div>

            <div className="mt-2.5 flex items-center gap-2 rounded-xl px-1 py-1">
              <span className="flex size-6 items-center justify-center rounded-full bg-brand text-[9px] font-semibold text-brand-foreground">AR</span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-[10.5px] font-semibold">Abhishek Raj</p>
                <p className="truncate text-[9px] text-faint-foreground">Pro plan</p>
              </div>
            </div>
          </aside>

          {/* main */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex h-10 items-center gap-1.5 px-1.5 text-[11px]">
              <span className="hidden font-semibold text-foreground sm:inline">Acme Studio</span>
              <span className="hidden text-faint-foreground sm:inline">/</span>
              <span className="min-w-0 truncate font-semibold text-foreground">Dashboard</span>
              <div className="ml-auto flex shrink-0 items-center gap-1.5">
                <span className="flex size-7 items-center justify-center rounded-full bg-card text-muted-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--shadow-color)_7%,transparent)]">
                  <Search className="size-3.5" />
                </span>
                <span className="flex size-7 items-center justify-center rounded-full bg-card text-muted-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--shadow-color)_7%,transparent)]">
                  <Bell className="size-3.5" />
                </span>
                <span className="inline-flex h-7 shrink-0 items-center rounded-full bg-primary px-3 text-[10px] font-semibold whitespace-nowrap text-primary-foreground shadow-[0_6px_14px_-8px_color-mix(in_oklab,var(--brand)_80%,transparent)]">
                  New project
                </span>
              </div>
            </div>

            <div className="px-1.5 pb-2">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-[20px] leading-tight font-extrabold tracking-[-0.04em]">Dashboard</h3>
                  <p className="mt-0.5 text-[10.5px] font-medium text-muted-foreground">Welcome back, Abhishek</p>
                </div>
                <span className="mb-0.5 hidden items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[9.5px] font-semibold text-muted-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--shadow-color)_6%,transparent)] sm:inline-flex">
                  <CalendarDays className="size-3" /> Last 30 days
                </span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {stats.map(({ icon: Icon, ...stat }) => (
                  <div key={stat.label} className="surface rounded-2xl p-3">
                    <div className="flex items-start justify-between">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-foreground">
                        <Icon className="size-3.5" />
                      </span>
                      <Badge variant="success" className="h-5 px-2 text-[9.5px] font-bold">{stat.delta}</Badge>
                    </div>
                    <p className="mt-3 text-[10px] font-semibold text-muted-foreground">{stat.label}</p>
                    <p className="stat-figure mt-0.5 text-[22px]">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-2 grid gap-2 sm:grid-cols-[1.5fr_1fr]">
                <div className="surface rounded-2xl p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11.5px] font-bold tracking-[-0.01em]">Revenue</p>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold text-muted-foreground">12 months</span>
                  </div>
                  <div className="mt-3 flex h-20 items-end gap-1 md:gap-1.5">
                    {bars.map((h, i) => (
                      <div
                        key={i}
                        className={cn(
                          "flex-1 rounded-t-md",
                          i === bars.length - 1 ? "bg-brand" : "bg-[color-mix(in_oklab,var(--brand)_20%,var(--muted))]"
                        )}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="surface hidden flex-col gap-2.5 rounded-2xl p-3 sm:flex">
                  <p className="text-[11.5px] font-bold tracking-[-0.01em]">Plan mix</p>
                  {[
                    { label: "Pro yearly", v: 46, c: "bg-chart-1" },
                    { label: "Pro monthly", v: 34, c: "bg-chart-2" },
                    { label: "Free", v: 20, c: "bg-chart-5" },
                  ].map((p) => (
                    <div key={p.label} className="grid gap-1">
                      <div className="flex justify-between text-[9.5px]">
                        <span className="text-muted-foreground">{p.label}</span>
                        <span className="font-semibold tabular-nums">{p.v}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", p.c)} style={{ width: `${p.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface mt-2 hidden overflow-hidden rounded-2xl sm:block">
                <div className="grid grid-cols-[1.6fr_1fr_0.9fr_0.55fr] border-b border-border/70 px-3 py-2 text-[8.5px] font-semibold tracking-[0.06em] text-faint-foreground uppercase">
                  <span>Customer</span>
                  <span>Plan</span>
                  <span>Status</span>
                  <span className="text-right">Amount</span>
                </div>
                {rows.map((r) => (
                  <div key={r.email} className="grid grid-cols-[1.6fr_1fr_0.9fr_0.55fr] items-center border-b border-border/60 px-3 py-2 text-[10.5px] last:border-0">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{r.name}</span>
                      <span className="block truncate text-[9px] text-faint-foreground">{r.email}</span>
                    </span>
                    <span className="truncate text-muted-foreground">{r.plan}</span>
                    <span>
                      <Badge
                        dot
                        variant={statusVariant[r.status as keyof typeof statusVariant]}
                        className="h-5 px-2 text-[9px]"
                      >
                        {r.status}
                      </Badge>
                    </span>
                    <span className="text-right font-semibold tabular-nums">{r.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
