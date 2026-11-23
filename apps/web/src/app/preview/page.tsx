"use client";

import { ArrowDownRight, ArrowUpRight, Download, Filter, MoreHorizontal, Plus, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Revenue", value: "$12,480", delta: "+12.4%", up: true, spark: [8, 10, 9, 12, 11, 14, 13, 16, 18] },
  { label: "Subscribers", value: "1,284", delta: "+8.1%", up: true, spark: [5, 6, 6, 7, 8, 8, 9, 10, 11] },
  { label: "Churn", value: "2.3%", delta: "-0.4%", up: false, spark: [9, 8, 9, 7, 7, 6, 6, 5, 5] },
  { label: "Credits used", value: "48.2k", delta: "+3.9%", up: true, spark: [6, 7, 9, 8, 10, 9, 11, 12, 12] },
];

const series = [42, 48, 45, 58, 54, 63, 60, 71, 69, 78, 74, 86, 81, 90];

const activity = [
  { id: "INV-2041", name: "Aarav Mehta", email: "aarav@lumen.dev", plan: "Pro yearly", status: "Paid", amount: "$99.00", date: "Nov 23" },
  { id: "INV-2040", name: "Sofia Romero", email: "sofia@northwind.io", plan: "Pro monthly", status: "Paid", amount: "$15.00", date: "Nov 23" },
  { id: "INV-2039", name: "Kenji Watanabe", email: "kenji@hikari.jp", plan: "Hobby", status: "Trial", amount: "$0.00", date: "Nov 22" },
  { id: "INV-2038", name: "Lena Fischer", email: "lena@atelier.de", plan: "Pro monthly", status: "Past due", amount: "$15.00", date: "Nov 21" },
  { id: "INV-2037", name: "Omar Haddad", email: "omar@sable.co", plan: "Pro yearly", status: "Refunded", amount: "$99.00", date: "Nov 20" },
];

const statusVariant = { Paid: "success", Trial: "info", "Past due": "warning", Refunded: "outline" } as const;

function Sparkline({ data, up }: { data: number[]; up: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * 100},${28 - ((d - min) / (max - min || 1)) * 24}`).join(" ");
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-8 w-24" aria-hidden="true">
      <polyline points={pts} fill="none" stroke={up ? "var(--success)" : "var(--destructive)"} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function AreaChart() {
  const max = 100;
  const pts = series.map((d, i) => [(i / (series.length - 1)) * 600, 200 - (d / max) * 180]);
  const line = pts.map(([x, y]) => `${x},${y}`).join(" ");
  return (
    <svg viewBox="0 0 600 200" className="h-56 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.28" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[40, 80, 120, 160].map((y) => (
        <line key={y} x1="0" x2="600" y1={y} y2={y} stroke="var(--border)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />
      ))}
      <polygon points={`0,200 ${line} 600,200`} fill="url(#area)" />
      <polyline points={line} fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function ShellPreviewPage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="grid gap-1">
          <p className="eyebrow">Overview</p>
          <h1 className="text-2xl font-semibold tracking-[-0.03em]">Good morning, Abhishek</h1>
          <p className="text-sm text-muted-foreground">Here is what happened across your workspace in the last 30 days.</p>
        </div>
        <div className="flex items-center gap-2">
          <SegmentedControl defaultValue="30d" aria-label="Range">
            <SegmentedControlItem value="7d">7d</SegmentedControlItem>
            <SegmentedControlItem value="30d">30d</SegmentedControlItem>
            <SegmentedControlItem value="90d">90d</SegmentedControlItem>
          </SegmentedControl>
          <Button variant="secondary" size="sm"><Download /> Export</Button>
          <Button size="sm"><Plus /> New project</Button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="gap-0 py-0">
            <div className="flex items-start justify-between p-4">
              <div className="grid gap-1">
                <p className="text-[13px] text-muted-foreground">{s.label}</p>
                <p className="text-[26px] leading-none font-semibold tracking-[-0.04em] tabular-nums">{s.value}</p>
              </div>
              <Sparkline data={s.spark} up={s.up} />
            </div>
            <div className="flex items-center gap-1.5 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
              <span className={cn("inline-flex items-center gap-0.5 font-mono", s.up ? "text-success-text" : "text-destructive-text")}>
                {s.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {s.delta}
              </span>
              vs last period
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Monthly recurring revenue</CardTitle>
            <CardDescription>
              <span className="text-[22px] font-semibold tracking-[-0.03em] text-foreground tabular-nums">$12,480</span>{" "}
              <span className="font-mono text-xs text-success-text">+12.4%</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AreaChart />
            <div className="mt-2 flex justify-between font-mono text-[10.5px] text-faint-foreground">
              {["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"].map((m) => (
                <span key={m}>{m}</span>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Getting started</CardTitle>
            <CardDescription>3 of 5 steps done</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Progress value={60} label="Workspace setup" />
            <ul className="grid gap-1">
              {[
                ["Connect Convex deployment", true],
                ["Configure email OTP", true],
                ["Create R2 bucket", true],
                ["Add Polar products", false],
                ["Invite your team", false],
              ].map(([label, done]) => (
                <li key={label as string} className="flex items-center gap-2.5 rounded-md px-1 py-1.5 text-sm">
                  <Checkbox defaultChecked={done as boolean} aria-label={label as string} />
                  <span className={cn(done ? "text-muted-foreground line-through decoration-border-strong" : "text-foreground")}>{label as string}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-3 gap-0 overflow-hidden py-0">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <Users className="size-4 text-faint-foreground" />
            <p className="text-[15px] font-semibold tracking-[-0.015em]">Recent invoices</p>
            <Badge variant="outline">{activity.length}</Badge>
          </div>
          <div className="flex gap-1.5">
            <Button variant="ghost" size="xs"><Filter /> Filter</Button>
            <Button variant="ghost" size="icon-xs" aria-label="More"><MoreHorizontal /></Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.id}</TableCell>
                <TableCell>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-xs text-faint-foreground">{r.email}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">{r.plan}</TableCell>
                <TableCell>
                  <Badge dot variant={statusVariant[r.status as keyof typeof statusVariant]}>{r.status}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{r.date}</TableCell>
                <TableCell className="text-right font-mono">{r.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
