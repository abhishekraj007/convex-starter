"use client";

import * as React from "react";
import { Progress as UiProgress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue } from "@ui-sdk/react/progress";

import { cn } from "@/lib/utils";

function Progress({
  className,
  label,
  showValue = true,
  ...props
}: React.ComponentProps<typeof UiProgress> & { label?: string; showValue?: boolean }) {
  return (
    <UiProgress className={cn("min-w-0 gap-y-2", className)} {...props}>
      {label ? <ProgressLabel className="text-[13px] font-medium">{label}</ProgressLabel> : <span />}
      {showValue ? <ProgressValue className="font-mono text-xs" /> : <span />}
      <ProgressTrack className="col-span-2 h-1.5 overflow-hidden rounded-full bg-muted">
        <ProgressIndicator className="rounded-full bg-[linear-gradient(90deg,color-mix(in_oklab,var(--brand)_70%,var(--chart-3)),var(--brand))] transition-[width] duration-500" />
      </ProgressTrack>
    </UiProgress>
  );
}

export { Progress };
