"use client";

import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Download, Filter, MoreHorizontal, Search, UserPlus } from "lucide-react";

import { PageShell } from "@/components/admin/page-shell";
import { PageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pagination } from "@/components/ui/pagination";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Total users", value: "12,847", delta: "+4.2%", up: true, bars: [4, 6, 5, 7, 6, 8, 9, 8, 10, 11, 10, 12] },
  { label: "Active today", value: "1,932", delta: "+11.8%", up: true, bars: [6, 5, 7, 6, 8, 7, 9, 10, 9, 11, 12, 13] },
  { label: "Premium", value: "843", delta: "+2.1%", up: true, bars: [5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 9] },
  { label: "Flagged uploads", value: "17", delta: "-23%", up: false, bars: [12, 10, 11, 9, 8, 9, 7, 6, 7, 5, 4, 4] },
];

const users = [
  { name: "Aarav Mehta", email: "aarav@lumen.dev", role: "Admin", plan: "Pro yearly", status: "Active", seen: "2m ago", credits: 1240 },
  { name: "Sofia Romero", email: "sofia@northwind.io", role: "Member", plan: "Pro monthly", status: "Active", seen: "14m ago", credits: 312 },
  { name: "Kenji Watanabe", email: "kenji@hikari.jp", role: "Member", plan: "Free", status: "Invited", seen: "—", credits: 50 },
  { name: "Lena Fischer", email: "lena@atelier.de", role: "Member", plan: "Pro monthly", status: "Past due", seen: "3h ago", credits: 8 },
  { name: "Omar Haddad", email: "omar@sable.co", role: "Support", plan: "Pro yearly", status: "Active", seen: "1d ago", credits: 905 },
  { name: "Priya Nair", email: "priya@kite.so", role: "Member", plan: "Free", status: "Suspended", seen: "6d ago", credits: 0 },
  { name: "Lucas Moreau", email: "lucas@ombre.fr", role: "Member", plan: "Pro monthly", status: "Active", seen: "2d ago", credits: 140 },
];

const statusVariant = { Active: "success", Invited: "info", "Past due": "warning", Suspended: "destructive" } as const;

export default function ConsolePreviewPage() {
  const [selected, setSelected] = React.useState<string[]>(["sofia@northwind.io"]);
  return (
    <PageShell>
      <PageHeader
        title="Users"
        subtitle="Everyone with an account across web and mobile. Changes apply immediately."
        actions={
          <>
            <Button variant="secondary" size="sm"><Download /> Export CSV</Button>
            <Button size="sm"><UserPlus /> Invite user</Button>
          </>
        }
      />

      <div className="grid overflow-hidden rounded-xl border border-border bg-card shadow-[inset_0_1px_0_var(--highlight),var(--elev-1)] sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={cn("grid gap-3 p-4", i > 0 && "border-t border-border sm:border-t-0 sm:border-l", i === 2 && "sm:border-l-0 lg:border-l", i >= 2 && "sm:border-t lg:border-t-0")}>
            <div className="flex items-center justify-between">
              <p className="text-[12.5px] font-medium text-muted-foreground">{s.label}</p>
              <span className={cn("inline-flex items-center gap-0.5 rounded-full px-1.5 py-px font-mono text-[10.5px]", s.up ? "bg-success/10 text-success-text" : "bg-destructive/10 text-destructive-text")}>
                {s.up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {s.delta}
              </span>
            </div>
            <div className="flex items-end justify-between gap-4">
              <p className="text-[26px] leading-none font-semibold tracking-[-0.035em] tabular-nums">{s.value}</p>
              <div className="flex h-7 items-end gap-[3px]" aria-hidden="true">
                {s.bars.map((b, j) => (
                  <span key={j} className={cn("w-[3px] rounded-full", j === s.bars.length - 1 ? "bg-primary" : "bg-border-strong")} style={{ height: `${(b / 13) * 100}%` }} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Card className="mt-4 gap-0 overflow-hidden py-0">
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2.5">
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-faint-foreground" />
            <Input placeholder="Search name or email" className="h-8 pr-10 pl-8 text-[13px]" />
            <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">/</Kbd>
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="h-8 w-auto min-w-0 gap-2 px-2.5 text-[13px]">
              <span className="text-muted-foreground">Plan:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm"><Filter /> More filters</Button>
          <div className="ml-auto flex items-center gap-2">
            {selected.length ? (
              <span className="text-[12.5px] text-muted-foreground">
                <span className="font-medium text-foreground tabular-nums">{selected.length}</span> selected
              </span>
            ) : null}
            <SegmentedControl defaultValue="all" aria-label="Status">
              <SegmentedControlItem value="all">All</SegmentedControlItem>
              <SegmentedControlItem value="active">Active</SegmentedControlItem>
              <SegmentedControlItem value="flagged">Flagged</SegmentedControlItem>
            </SegmentedControl>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10">
                <Checkbox aria-label="Select all" checked={selected.length === users.length} onCheckedChange={(v) => setSelected(v ? users.map((u) => u.email) : [])} />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Credits</TableHead>
              <TableHead className="text-right">Last seen</TableHead>
              <TableHead className="w-10"><span className="sr-only">Actions</span></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u, i) => {
              const isSel = selected.includes(u.email);
              return (
                <TableRow key={u.email} data-state={isSel ? "selected" : undefined} className={cn(isSel && "bg-brand-soft/60 hover:bg-brand-soft")}>
                  <TableCell>
                    <Checkbox aria-label={`Select ${u.name}`} checked={isSel} onCheckedChange={(v) => setSelected((cur) => (v ? [...cur, u.email] : cur.filter((e) => e !== u.email)))} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-7">
                        <AvatarFallback className="text-[11px] text-white" style={{ background: `var(--chart-${(i % 5) + 1})` }}>
                          {u.name.split(" ").map((p) => p[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="leading-tight">
                        <p className="font-medium">{u.name}</p>
                        <p className="text-xs text-faint-foreground">{u.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{u.role === "Admin" ? <Badge variant="brand">Admin</Badge> : <span className="text-muted-foreground">{u.role}</span>}</TableCell>
                  <TableCell className="text-muted-foreground">{u.plan}</TableCell>
                  <TableCell><Badge dot variant={statusVariant[u.status as keyof typeof statusVariant]}>{u.status}</Badge></TableCell>
                  <TableCell className="text-right font-mono text-[12.5px]">{u.credits.toLocaleString("en-US")}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{u.seen}</TableCell>
                  <TableCell><Button variant="ghost" size="icon-xs" aria-label={`Actions for ${u.name}`}><MoreHorizontal /></Button></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t border-border px-3 py-2">
          <p className="text-[12.5px] text-muted-foreground">Showing <span className="text-foreground tabular-nums">1–7</span> of <span className="text-foreground tabular-nums">12,847</span></p>
          <Pagination pageCount={128} defaultPage={1} />
        </div>
      </Card>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Remote config</CardTitle>
            <CardDescription>Pushed to every client on next launch.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="minv" className="text-[13px]">Minimum app version</Label>
              <Input id="minv" defaultValue="2.4.0" className="font-mono text-[13px]" />
            </div>
            <div className="grid gap-1.5">
              <Label className="text-[13px]">Default plan</Label>
              <Select defaultValue="free">
                <SelectTrigger className="w-full min-w-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="trial">14-day trial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <label className="flex items-center justify-between gap-4 rounded-lg border border-border px-3 py-2.5 sm:col-span-2">
              <span>
                <span className="block text-[13px] font-medium">Maintenance mode</span>
                <span className="block text-xs text-muted-foreground">Shows a banner and blocks writes.</span>
              </span>
              <Switch aria-label="Maintenance mode" />
            </label>
          </CardContent>
          <CardFooter className="justify-between border-t border-border pt-4">
            <span className="text-xs text-faint-foreground">Last published 2h ago by Aarav</span>
            <div className="flex gap-1.5">
              <Button variant="ghost" size="sm">Discard</Button>
              <Button size="sm">Publish</Button>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Activity</CardTitle>
            <CardDescription>Admin actions in the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="relative grid gap-4 border-l border-border pl-4">
              {[
                ["bg-primary", "Aarav published remote config", "2h ago"],
                ["bg-success", "Notification sent to 1,284 devices", "5h ago"],
                ["bg-warning", "Upload img_8f21.webp flagged", "9h ago"],
                ["bg-destructive", "Priya Nair suspended", "21h ago"],
              ].map(([tone, text, when]) => (
                <li key={text} className="relative">
                  <span className={cn("absolute top-1.5 -left-[21px] size-2 rounded-full ring-4 ring-card", tone)} />
                  <p className="text-[13px]">{text}</p>
                  <p className="text-xs text-faint-foreground">{when}</p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
