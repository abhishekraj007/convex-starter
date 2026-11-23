"use client";

import * as React from "react";
import {
  SegmentedControl as UiSegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem as UiSegmentedControlItem,
} from "@ui-sdk/react/segmented-control";

import { cn } from "@/lib/utils";

function SegmentedControl({ className, children, ...props }: Omit<React.ComponentProps<typeof UiSegmentedControl>, "children"> & { children?: React.ReactNode }) {
  return (
    <UiSegmentedControl className={cn("rounded-lg border-0 bg-muted p-0.5", className)} {...props}>
      <SegmentedControlIndicator className="rounded-md bg-card" />
      {children}
    </UiSegmentedControl>
  );
}

function SegmentedControlItem({ className, ...props }: React.ComponentProps<typeof UiSegmentedControlItem>) {
  return (
    <UiSegmentedControlItem
      className={cn("h-7 gap-1.5 rounded-md px-3 text-[13px] font-medium text-muted-foreground transition-colors data-checked:text-foreground [&_svg]:size-3.5", className)}
      {...props}
    />
  );
}

export { SegmentedControl, SegmentedControlItem };
