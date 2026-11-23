"use client";

import * as React from "react";
import { Checkbox as UiCheckbox, CheckboxIndicator } from "@ui-sdk/react/checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof UiCheckbox>) {
  return (
    <UiCheckbox
      className={cn(
        "peer size-4 shrink-0 rounded-full border border-input shadow-xs transition-shadow outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxIndicator className="flex size-full items-center justify-center">
        <CheckIcon className="size-3.5" />
      </CheckboxIndicator>
    </UiCheckbox>
  );
}

export { Checkbox };
