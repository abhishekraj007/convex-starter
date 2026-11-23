"use client";

import { Activity, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLockup, BrandMark } from "@/components/brand-mark";
import { ModeToggle } from "@/components/mode-toggle";

const events = [
  { t: "09:41:12", tone: "bg-success", msg: "admin.session.created", meta: "abhishek@acme.dev · OTP" },
  { t: "09:40:58", tone: "bg-primary", msg: "config.updated", meta: "app.minVersion → 2.4.0" },
  { t: "09:38:03", tone: "bg-warning", msg: "upload.flagged", meta: "img_8f21.webp · 11.2 MB" },
  { t: "09:31:47", tone: "bg-success", msg: "notification.sent", meta: "1,284 devices · iOS + Android" },
];

/**
 * Split auth layout: a dark console panel on the left (brand, live-looking audit log,
 * trust notes) and a focused form column on the right. The panel stays dark in both
 * themes so the console identity is unmistakable.
 */
export function AdminAuthShell({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="dark relative hidden overflow-hidden border-r border-border bg-background text-foreground lg:flex lg:flex-col">
        <div aria-hidden="true" className="absolute inset-0 bg-grid [mask-image:radial-gradient(80%_60%_at_20%_10%,black,transparent)]" />
        <div aria-hidden="true" className="absolute -top-40 -left-24 size-[560px] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--primary)_32%,transparent),transparent)]" />
        <div aria-hidden="true" className="noise absolute inset-0" />
        <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">
          <BrandLockup />
          <div className="max-w-lg">
            <p className="eyebrow">Operator console</p>
            <h2 className="mt-3 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.04em]">
              Run the product <span className="text-muted-foreground">from one quiet room.</span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
              Users, uploads, remote config and push notifications for every Convex Starter app, behind admin-only access.
            </p>
            <div className="surface mt-8 overflow-hidden rounded-xl">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="flex items-center gap-2 text-[12.5px] font-medium">
                  <Activity className="size-3.5 text-brand" /> Audit log
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10.5px] text-success-text">
                  <span className="size-1.5 animate-pulse rounded-full bg-success" /> LIVE
                </span>
              </div>
              <ul className="divide-y divide-border">
                {events.map((e) => (
                  <li key={e.t} className="grid grid-cols-[64px_8px_1fr] items-center gap-3 px-4 py-2.5 font-mono text-[11.5px]">
                    <span className="text-faint-foreground">{e.t}</span>
                    <span className={cn("size-1.5 rounded-full", e.tone)} />
                    <span className="flex min-w-0 justify-between gap-3">
                      <span className="text-foreground">{e.msg}</span>
                      <span className="truncate text-faint-foreground">{e.meta}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><ShieldCheck className="size-3.5" /> Admin role enforced server-side</span>
            <span className="flex items-center gap-1.5"><Lock className="size-3.5" /> Sessions via Better Auth</span>
          </div>
        </div>
      </aside>

      <main className="relative flex flex-col">
        <div className="flex items-center justify-between p-5 lg:justify-end">
          <span className="lg:hidden"><BrandLockup /></span>
          <ModeToggle />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className={cn("w-full max-w-[380px] space-y-6", className)}>
            <header className="space-y-2">
              <BrandMark className="size-9 rounded-lg [&>svg]:size-5" />
              <h1 className="pt-3 text-[1.75rem] leading-tight font-semibold tracking-[-0.035em]">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </header>
            {children}
          </div>
        </div>
        <p className="px-6 pb-6 text-center text-xs text-faint-foreground lg:text-left">
          Protected area · access is logged
        </p>
      </main>
    </div>
  );
}

export function AdminFormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/25 bg-destructive/[0.07] px-3 py-2 text-[13px] text-destructive-text"
    >
      {message}
    </p>
  );
}
