"use client";

import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

type Step = {
  label: string;
  href: "/settings" | "/uploads" | "/pricing";
  action: string;
  done: boolean;
};

export function GettingStarted({ uploadCount, isPremium }: { uploadCount: number; isPremium: boolean }) {
  const steps: Step[] = [
    { label: "Create your account", href: "/settings", action: "Review", done: true },
    { label: "Upload your first image", href: "/uploads", action: "Upload", done: uploadCount > 0 },
    { label: "Unlock the full workspace", href: "/pricing", action: "View plans", done: isPremium },
  ];
  const completed = steps.filter((step) => step.done).length;
  const total = steps.length;
  const percent = (completed / total) * 100;

  return (
    <section className="surface flex flex-col rounded-3xl p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-[17px] font-bold tracking-[-0.025em]">Getting started</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">A few steps to get the most out of your workspace.</p>
        </div>
        <span className="text-[11px] font-semibold text-muted-foreground tabular-nums">
          {completed}/{total}
        </span>
      </header>

      <div
        role="progressbar"
        aria-label="Workspace setup progress"
        aria-valuenow={completed}
        aria-valuemin={0}
        aria-valuemax={total}
        className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"
      >
        <div
          className={cn("h-full rounded-full transition-[width] duration-500", completed === total ? "bg-success" : "bg-brand")}
          style={{ width: `${percent}%` }}
        />
      </div>

      <ul className="mt-3 grid gap-0.5">
        {steps.map((step) => (
          <li key={step.label}>
            <Link
              href={step.href}
              className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-accent"
            >
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full",
                  step.done
                    ? "bg-success-fill text-success-fill-foreground"
                    : "border border-border-strong text-faint-foreground"
                )}
              >
                {step.done ? <Check className="size-3.5" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-current" />}
              </span>
              <span className="min-w-0 flex-1 text-[13px] font-medium">{step.label}</span>
              <span className={cn("text-[11px] font-semibold", step.done ? "text-success-text" : "text-brand-text")}>
                {step.done ? "Done" : step.action}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-auto pt-4 text-[10.5px] leading-relaxed text-muted-foreground">
        {completed === total
          ? "You are all set. Everything is unlocked."
          : "Finish setup to get the most out of the starter."}
      </p>
    </section>
  );
}
