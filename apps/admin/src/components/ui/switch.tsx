"use client";

import * as React from "react";
import { Switch as UiSwitch, SwitchThumb } from "@ui-sdk/react/switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof UiSwitch> & {
  size?: "sm" | "default";
}) {
  return (
    <UiSwitch
      data-size={size}
      className={cn(
        "relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
        className
      )}
      {...props}
    >
      <SwitchThumb
        className={cn(
          "pointer-events-none block rounded-full ring-0 transition-transform",
          size === "default" ? "size-4" : "size-3"
        )}
      />
    </UiSwitch>
  );
}

export { Switch };
