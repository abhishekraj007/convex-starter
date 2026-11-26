import { cn } from "@/lib/utils";

/** Convex Starter mark: a Node C — a bold C with a mint node in its opening. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex size-6 shrink-0 items-center justify-center rounded-[27%] bg-[linear-gradient(135deg,#5B64FF_0%,#414BF0_100%)] text-primary-foreground shadow-[inset_0_1px_0_color-mix(in_oklab,var(--primary-foreground)_22%,transparent),0_1px_2px_oklch(0_0_0/0.18)]",
        className
      )}
    >
      <svg viewBox="0 0 64 64" className="size-full">
        <path d="M46.6 22.3A17.5 17.5 0 1 0 46.6 41.7" fill="none" stroke="currentColor" strokeWidth="8.5" strokeLinecap="round" />
        <circle cx="47.2" cy="32" r="3.2" fill="var(--success-fill)" />
      </svg>
    </span>
  );
}

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex min-w-0 items-center gap-2 whitespace-nowrap text-[15px] tracking-[-0.035em]", className)}>
      <BrandMark />
      <span className="min-w-0 truncate">
        <span className="font-extrabold">Convex</span>{" "}
        <span className="ml-[0.14em] font-medium text-muted-foreground">Starter</span>
      </span>
    </span>
  );
}
