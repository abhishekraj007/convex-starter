import { cn } from "@/lib/utils";

/** Admin mark: a cobalt tile with a console prompt glyph. Distinct from the web app's stacked layers. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.25),0_0_0_1px_color-mix(in_oklab,var(--primary)_70%,black),0_2px_6px_-1px_color-mix(in_oklab,var(--primary)_50%,transparent)]",
        className
      )}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3.5 4.5 3.5 3.5-3.5 3.5" />
        <path d="M9 11.5h3.5" />
      </svg>
    </span>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <BrandMark />
      <span className="text-[13.5px] font-semibold tracking-[-0.015em]">Convex Starter</span>
      <span className="rounded-md border border-border px-1.5 py-px font-mono text-[10px] text-muted-foreground">CONSOLE</span>
    </span>
  );
}
