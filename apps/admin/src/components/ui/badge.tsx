import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex h-5.5 w-fit shrink-0 items-center gap-1.5 rounded-full border px-2 text-xs font-medium whitespace-nowrap tabular-nums [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-foreground shadow-[inset_0_1px_0_var(--highlight)]",
        secondary: "border-transparent bg-muted text-muted-foreground",
        solid: "border-transparent bg-primary text-primary-foreground",
        brand: "border-brand/20 bg-brand/10 text-brand-text",
        success: "border-success/20 bg-success/10 text-success-text",
        warning: "border-warning/25 bg-warning/12 text-warning-text",
        info: "border-info/20 bg-info/10 text-info-text",
        destructive: "border-destructive/20 bg-destructive/10 text-destructive-text",
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
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  destructive: "bg-destructive",
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
