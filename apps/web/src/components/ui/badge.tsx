import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[11.5px] leading-none font-semibold tracking-[0.01em] whitespace-nowrap tabular-nums [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-transparent bg-card text-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--shadow-color)_6%,transparent)]",
        secondary: "border-transparent bg-muted text-muted-foreground",
        solid: "border-transparent bg-primary text-primary-foreground",
        brand: "border-transparent bg-brand-soft text-brand-text",
        success: "border-transparent bg-success-fill text-success-fill-foreground",
        warning: "border-transparent bg-warning/18 text-warning-text",
        info: "border-transparent bg-info/12 text-info-text",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "border-border-strong bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const dotColor: Record<string, string> = {
  default: "bg-faint-foreground",
  secondary: "bg-faint-foreground",
  solid: "bg-primary-foreground",
  brand: "bg-brand",
  success: "bg-success-fill-foreground",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive-foreground",
  outline: "bg-faint-foreground",
};

function Badge({
  className,
  variant,
  dot = false,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants> & { dot?: boolean }) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot ? <span aria-hidden="true" className={cn("size-1.5 rounded-full", dotColor[variant ?? "default"])} /> : null}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
