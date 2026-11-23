"use client";

import * as React from "react";
import { Slider as UiSlider, SliderControl, SliderIndicator, SliderThumb, SliderTrack } from "@ui-sdk/react/slider";

import { cn } from "@/lib/utils";

function Slider({
  className,
  thumbLabel = "Value",
  ...props
}: React.ComponentProps<typeof UiSlider> & { thumbLabel?: string }) {
  return (
    <UiSlider className={cn("min-w-0", className)} {...props}>
      <SliderControl className="flex h-5 items-center">
        <SliderTrack className="relative h-1.5 w-full rounded-full bg-muted shadow-[inset_0_1px_1px_color-mix(in_oklab,var(--shadow-color)_8%,transparent)]">
          <SliderIndicator className="rounded-full bg-primary" />
          <SliderThumb
            aria-label={thumbLabel}
            className="size-4.5 rounded-full border border-border-strong bg-white shadow-[0_1px_3px_oklch(0_0_0/0.2)] transition-shadow hover:shadow-[0_0_0_5px_color-mix(in_oklab,var(--ring)_18%,transparent)]"
          />
        </SliderTrack>
      </SliderControl>
    </UiSlider>
  );
}

export { Slider };
