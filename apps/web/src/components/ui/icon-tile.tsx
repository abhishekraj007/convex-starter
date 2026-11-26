import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const iconTileVariants = cva(
  "flex shrink-0 items-center justify-center rounded-lg [&_svg]:size-[18px]",
  {
    variants: {
      tone: {
        muted: "bg-muted text-foreground",
        brand: "bg-brand-soft text-brand",
        inverse: "bg-white/15 text-white",
        outline: "border border-border bg-transparent text-muted-foreground",
      },
      size: {
        sm: "size-8 [&_svg]:size-4",
        default: "size-10",
        lg: "size-12 [&_svg]:size-5",
      },
    },
    defaultVariants: { tone: "muted", size: "default" },
  }
);

function IconTile({
  className,
  tone,
  size,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof iconTileVariants>) {
  return (
    <span className={cn(iconTileVariants({ tone, size }), className)} {...props}>
      {children}
    </span>
  );
}

export { IconTile, iconTileVariants };
