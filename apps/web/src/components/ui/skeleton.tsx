import { cn } from "@/lib/utils";

/** Shimmering placeholder that follows the surface it sits on. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-shimmer rounded-md bg-[length:200%_100%] bg-[linear-gradient(90deg,var(--muted)_0%,color-mix(in_oklab,var(--muted)_55%,var(--card))_40%,var(--muted)_80%)]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
