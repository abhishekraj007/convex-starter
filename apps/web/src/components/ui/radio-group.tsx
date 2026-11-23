"use client";

import * as React from "react";
import { Radio, RadioGroup as UiRadioGroup, RadioIndicator } from "@ui-sdk/react/radio";

import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: React.ComponentProps<typeof UiRadioGroup>) {
  return <UiRadioGroup className={cn("grid gap-2.5", className)} {...props} />;
}

function RadioGroupItem({ className, ...props }: React.ComponentProps<typeof Radio>) {
  return (
    <Radio
      className={cn(
        "inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-card shadow-xs transition-colors data-checked:border-primary data-checked:bg-primary disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioIndicator className="size-1.5 rounded-full bg-primary-foreground" />
    </Radio>
  );
}

export { RadioGroup, RadioGroupItem };
