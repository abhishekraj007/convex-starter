"use client";

import * as React from "react";
import {
  Slider as UiSlider,
  SliderControl,
  SliderIndicator,
  SliderThumb,
  SliderTrack,
} from "@ui-sdk/react/slider";

import { cn } from "@/lib/utils";

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof UiSlider>) {
  const thumbCount = Array.isArray(value)
    ? value.length
    : Array.isArray(defaultValue)
      ? defaultValue.length
      : 1;

  return (
    <UiSlider
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn("w-full touch-none select-none", className)}
      {...props}
    >
      <SliderControl className="relative flex h-5 w-full items-center">
        <SliderTrack className="relative h-3 grow overflow-hidden rounded-4xl bg-muted">
          <SliderIndicator className="absolute h-full bg-primary select-none" />
        </SliderTrack>
        {Array.from({ length: thumbCount }, (_, index) => (
          <SliderThumb
            key={index}
            index={index}
            className="block size-4 shrink-0 rounded-full border border-primary bg-background shadow-sm transition-colors select-none hover:ring-4 hover:ring-ring/50 focus-visible:outline-hidden focus-visible:ring-4 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderControl>
    </UiSlider>
  );
}

export { Slider };
