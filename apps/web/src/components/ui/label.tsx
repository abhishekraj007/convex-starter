"use client";

import * as React from "react";
import { Label as UiLabel } from "@ui-sdk/react/label";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<typeof UiLabel>) {
  return (
    <UiLabel
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
