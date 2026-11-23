"use client";

import * as React from "react";
import { Input as UiInput } from "@ui-sdk/react/input";

import { cn } from "@/lib/utils";
import { fieldStyles } from "./field-styles";

function Input({ className, ...props }: React.ComponentProps<typeof UiInput>) {
  return (
    <UiInput
      className={cn(
        fieldStyles,
        "flex h-9 px-3 py-1 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  );
}

export { Input };
