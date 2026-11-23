"use client";

import * as React from "react";
import { Input as UiInput } from "@ui-sdk/react/input";

import { cn } from "@/lib/utils";

function Input({ className, ...props }: React.ComponentProps<typeof UiInput>) {
  return (
    <UiInput
      className={cn(
        "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Input };
