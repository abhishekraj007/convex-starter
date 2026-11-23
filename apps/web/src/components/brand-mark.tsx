import { cn } from "@/lib/utils";

/** Convex Starter mark: a stacked-layers glyph in an inverse tile with a lit top edge. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex size-6 items-center justify-center rounded-[7px] bg-primary text-primary-foreground shadow-[inset_0_1px_0_color-mix(in_oklab,var(--primary-foreground)_25%,transparent),0_1px_2px_oklch(0_0_0/0.2)]",
        className
      )}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
        <path d="M8 2 14 5.2 8 8.4 2 5.2 8 2Z" fill="currentColor" />
        <path d="m2 8 6 3.2L14 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
        <path d="m2 10.8 6 3.2 6-3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity=".4" />
      </svg>
    </span>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em]", className)}>
      <BrandMark />
      Convex Starter
    </span>
  );
}
