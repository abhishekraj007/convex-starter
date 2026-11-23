import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 rounded-xl border px-4 py-3 text-sm [&>svg]:mt-0.5 [&>svg]:size-4",
  {
    variants: {
      variant: {
        default: "surface-flat [&>svg]:text-muted-foreground",
        info: "border-info/25 bg-info/[0.07] [&>svg]:text-info",
        success: "border-success/25 bg-success/[0.07] [&>svg]:text-success",
        warning: "border-warning/30 bg-warning/[0.09] [&>svg]:text-warning",
        destructive: "border-destructive/25 bg-destructive/[0.07] [&>svg]:text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

const icons = { default: Info, info: Info, success: CircleCheck, warning: TriangleAlert, destructive: CircleAlert };

function Alert({
  className,
  variant = "default",
  icon,
  children,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants> & { icon?: React.ReactNode }) {
  const Icon = icons[variant ?? "default"];
  return (
    <div role="status" data-slot="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      {icon ?? <Icon aria-hidden="true" />}
      <div className="col-start-2 grid gap-0.5">{children}</div>
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="alert-title" className={cn("font-medium leading-snug text-foreground", className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="alert-description" className={cn("leading-relaxed text-muted-foreground", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
