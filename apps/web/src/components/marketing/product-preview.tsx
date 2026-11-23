import {
  ArrowUpRight,
  Bell,
  CheckSquare,
  ChevronDown,
  CreditCard,
  Home,
  LayoutDashboard,
  Search,
  Upload,
} from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

const bars = [32, 44, 38, 52, 48, 61, 58, 72, 66, 80, 76, 92];

const rows = [
  { name: "Aarav Mehta", email: "aarav@lumen.dev", plan: "Pro · yearly", status: "Active", amount: "$96.00" },
  { name: "Sofia Romero", email: "sofia@northwind.io", plan: "Pro · monthly", status: "Active", amount: "$9.99" },
  { name: "Kenji Watanabe", email: "kenji@hikari.jp", plan: "Free", status: "Trial", amount: "$0.00" },
  { name: "Lena Fischer", email: "lena@atelier.de", plan: "Pro · monthly", status: "Past due", amount: "$9.99" },
];

/** Static, non-interactive product shot built from the real design tokens and components. */
export function ProductPreview({ className }: { className?: string }) {
  return (
    <div className={cn("frame-glow rounded-[20px] p-px shadow-[var(--elev-4)]", className)} aria-hidden="true">
      <div className="overflow-hidden rounded-[19px] bg-background">
        {/* window chrome */}
        <div className="flex h-10 items-center gap-3 border-b border-border bg-subtle px-4">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[oklch(0.7_0.17_25)]" />
            <span className="size-2.5 rounded-full bg-[oklch(0.8_0.15_80)]" />
            <span className="size-2.5 rounded-full bg-[oklch(0.72_0.15_150)]" />
          </div>
          <div className="mx-auto flex h-6 w-72 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-2 font-mono text-[11px] text-muted-foreground">
            app.convex-starter.dev/dashboard
          </div>
          <div className="w-12" />
        </div>
        <div className="grid grid-cols-[208px_1fr] text-left">
          {/* sidebar */}
          <div className="flex flex-col gap-4 border-r border-border bg-sidebar p-3">
            <div className="flex items-center gap-2 px-1.5 pt-0.5">
              <BrandMark className="size-5 rounded-[6px]" />
              <span className="text-[13px] font-semibold tracking-[-0.01em]">Acme Studio</span>
              <ChevronDown className="ml-auto size-3.5 text-faint-foreground" />
            </div>
            <div className="flex h-7 items-center gap-2 rounded-md border border-border bg-card px-2 text-[12px] text-faint-foreground">
              <Search className="size-3.5" /> Search
              <Kbd className="ml-auto h-4 text-[10px]">⌘K</Kbd>
            </div>
            <div className="grid gap-0.5">
              <p className="eyebrow px-2 pb-1 !text-[10px]">Workspace</p>
              {[
                { icon: Home, label: "Home" },
                { icon: LayoutDashboard, label: "Dashboard", active: true },
                { icon: CheckSquare, label: "Todos", count: "12" },
                { icon: Upload, label: "Uploads" },
                { icon: CreditCard, label: "Billing" },
              ].map(({ icon: Icon, label, active, count }) => (
                <div
                  key={label}
                  className={cn(
                    "relative flex h-7 items-center gap-2 rounded-md px-2 text-[12.5px] text-sidebar-foreground",
                    active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-[inset_0_1px_0_var(--highlight)]"
                  )}
                >
                  {active ? <span className="absolute top-1.5 bottom-1.5 -left-3 w-0.5 rounded-full bg-brand" /> : null}
                  <Icon className={cn("size-3.5", active ? "text-brand" : "text-faint-foreground")} />
                  {label}
                  {count ? <span className="ml-auto font-mono text-[10.5px] text-faint-foreground">{count}</span> : null}
                </div>
              ))}
            </div>
            <div className="mt-auto flex items-center gap-2 rounded-md px-1.5 py-1">
              <span className="flex size-6 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--chart-1),var(--chart-3))] text-[10px] font-semibold text-white">AR</span>
              <div className="leading-tight">
                <p className="text-[12px] font-medium">Abhishek Raj</p>
                <p className="text-[10.5px] text-faint-foreground">Pro plan</p>
              </div>
            </div>
          </div>
          {/* main */}
          <div className="flex min-w-0 flex-col">
            <div className="flex h-11 items-center gap-2 border-b border-border px-5 text-[12.5px]">
              <span className="text-muted-foreground">Acme Studio</span>
              <span className="text-faint-foreground">/</span>
              <span className="font-medium">Dashboard</span>
              <div className="ml-auto flex items-center gap-2">
                <Bell className="size-3.5 text-faint-foreground" />
                <span className="inline-flex h-6 items-center rounded-full bg-primary px-2.5 text-[11.5px] font-medium text-primary-foreground">New project</span>
              </div>
            </div>
            <div className="grid gap-4 p-5">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Monthly revenue", value: "$12,480", delta: "+12.4%" },
                  { label: "Active subscribers", value: "1,284", delta: "+8.1%" },
                  { label: "Credits used", value: "48.2k", delta: "+3.9%" },
                ].map((s) => (
                  <div key={s.label} className="surface rounded-lg p-3">
                    <p className="text-[11.5px] text-muted-foreground">{s.label}</p>
                    <div className="mt-1 flex items-baseline justify-between">
                      <p className="text-[19px] font-semibold tracking-[-0.03em] tabular-nums">{s.value}</p>
                      <span className="inline-flex items-center gap-0.5 font-mono text-[10.5px] text-success-text">
                        <ArrowUpRight className="size-3" />
                        {s.delta}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-[1.4fr_1fr] gap-3">
                <div className="surface rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[12px] font-medium">Revenue</p>
                    <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">12 months</span>
                  </div>
                  <div className="mt-3 flex h-24 items-end gap-1.5">
                    {bars.map((h, i) => (
                      <div
                        key={i}
                        className={cn("flex-1 rounded-t-[3px]", i === bars.length - 1 ? "bg-brand" : "bg-[color-mix(in_oklab,var(--brand)_22%,var(--muted))]")}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="surface flex flex-col gap-2.5 rounded-lg p-3">
                  <p className="text-[12px] font-medium">Plan mix</p>
                  {[
                    { label: "Pro yearly", v: 46, c: "bg-chart-1" },
                    { label: "Pro monthly", v: 34, c: "bg-chart-2" },
                    { label: "Free", v: 20, c: "bg-chart-5" },
                  ].map((p) => (
                    <div key={p.label} className="grid gap-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">{p.label}</span>
                        <span className="font-mono tabular-nums">{p.v}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", p.c)} style={{ width: `${p.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="surface overflow-hidden rounded-lg">
                <div className="grid grid-cols-[1.6fr_1fr_0.8fr_0.6fr] border-b border-border bg-subtle px-3 py-2 text-[11px] font-medium text-muted-foreground">
                  <span>Customer</span>
                  <span>Plan</span>
                  <span>Status</span>
                  <span className="text-right">Amount</span>
                </div>
                {rows.map((r) => (
                  <div key={r.email} className="grid grid-cols-[1.6fr_1fr_0.8fr_0.6fr] items-center border-b border-border px-3 py-2 text-[12px] last:border-0">
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{r.name}</span>
                      <span className="block truncate text-[11px] text-faint-foreground">{r.email}</span>
                    </span>
                    <span className="text-muted-foreground">{r.plan}</span>
                    <span>
                      <Badge dot variant={r.status === "Active" ? "success" : r.status === "Trial" ? "info" : "warning"} className="h-5 text-[10.5px]">
                        {r.status}
                      </Badge>
                    </span>
                    <span className="text-right font-mono tabular-nums">{r.amount}</span>
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
