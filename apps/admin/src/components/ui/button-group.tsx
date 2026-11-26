import * as React from "react";

import { cn } from "@/lib/utils";

/** Joins adjacent buttons into one control with shared hairlines. */
function ButtonGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="button-group"
      className={cn(
        "inline-flex items-stretch rounded-lg shadow-[var(--elev-1)] [&>*]:rounded-none [&>*]:shadow-none [&>*:first-child]:rounded-l-lg [&>*:last-child]:rounded-r-lg [&>*:not(:first-child)]:-ml-px [&>*:focus-visible]:z-10",
        className
      )}
      {...props}
    />
  );
}

export { ButtonGroup };
