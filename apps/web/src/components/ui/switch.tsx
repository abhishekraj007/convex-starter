"use client";

import * as React from "react";
import { Switch as UiSwitch, SwitchThumb } from "@ui-sdk/react/switch";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof UiSwitch>) {
  return (
    <UiSwitch
      className={cn(
        "inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-transparent bg-border-strong p-0.5 transition-colors duration-200 data-checked:bg-primary disabled:opacity-50 dark:bg-white/15 dark:data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <SwitchThumb className="size-4 rounded-full bg-white shadow-[0_1px_2px_oklch(0_0_0/0.25),0_0_0_0.5px_oklch(0_0_0/0.06)] transition-transform duration-200 ease-[var(--ease-spring)] data-checked:ms-0 data-checked:translate-x-4 data-checked:bg-primary-foreground" />
    </UiSwitch>
  );
}

export { Switch };
