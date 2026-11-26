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
    <UiSegmentedControl className={cn("rounded-full border-0 bg-muted p-1", className)} {...props}>
      <SegmentedControlIndicator className="rounded-full bg-card shadow-[0_1px_2px_color-mix(in_oklab,var(--shadow-color)_10%,transparent)]" />
      {children}
    </UiSegmentedControl>
  );
}

function SegmentedControlItem({ className, ...props }: React.ComponentProps<typeof UiSegmentedControlItem>) {
  return (
    <UiSegmentedControlItem
      className={cn("h-7 gap-1.5 rounded-full px-3 text-[13px] font-semibold text-muted-foreground transition-colors data-checked:text-foreground [&_svg]:size-3.5", className)}
      {...props}
    />
  );
}

export { SegmentedControl, SegmentedControlItem };
