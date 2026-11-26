"use client";

import * as React from "react";
import {
  Tooltip as UiTooltip,
  TooltipArrow,
  TooltipContent as UiTooltipContent,
  TooltipTrigger as UiTooltipTrigger,
} from "@ui-sdk/react/tooltip";

import { cn } from "@/lib/utils";

function TooltipProvider({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

function Tooltip({ ...props }: React.ComponentProps<typeof UiTooltip>) {
  return <UiTooltip delay={0} {...props} />;
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof UiTooltipTrigger>) {
  return <UiTooltipTrigger {...props} />;
}

function TooltipContent({
  className,
  children,
  hideArrow = false,
  ...props
}: Omit<React.ComponentProps<typeof UiTooltipContent>, "children"> & {
  children?: React.ReactNode;
  hideArrow?: boolean;
}) {
  return (
    <UiTooltipContent
      className={cn(
        "z-50 flex w-fit items-center gap-2 rounded-lg border border-promo-border bg-promo px-2.5 py-1.5 text-xs font-semibold text-balance text-promo-foreground shadow-[var(--elev-3)]",
        className
      )}
      {...props}
    >
      {children}
      {hideArrow ? null : (
        <TooltipArrow className="z-50 size-2.5 rounded-[2px] bg-promo fill-promo" />
      )}
    </UiTooltipContent>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
