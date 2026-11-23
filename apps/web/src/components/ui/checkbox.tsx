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
        "peer size-4 shrink-0 rounded-[5px] border border-input bg-card shadow-xs transition-[background-color,border-color] outline-none data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxIndicator className="flex size-full items-center justify-center">
        <CheckIcon className="size-3" strokeWidth={3} />
      </CheckboxIndicator>
    </UiCheckbox>
  );
}

export { Checkbox };
