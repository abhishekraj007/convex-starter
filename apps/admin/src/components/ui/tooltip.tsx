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
  ...props
}: Omit<React.ComponentProps<typeof UiTooltipContent>, "children"> & {
  children?: React.ReactNode;
}) {
  return (
    <UiTooltipContent
      className={cn(
        "z-50 w-fit rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background",
        className
      )}
      {...props}
    >
      {children}
      <TooltipArrow className="z-50 size-2.5 rounded-[2px] bg-foreground fill-foreground" />
    </UiTooltipContent>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
