"use client";

import * as React from "react";
import { Textarea as UiTextarea } from "@ui-sdk/react/textarea";

import { cn } from "@/lib/utils";
import { fieldStyles } from "./field-styles";

function Textarea({ className, ...props }: React.ComponentProps<typeof UiTextarea>) {
  return (
    <UiTextarea
      className={cn(fieldStyles, "min-h-24 resize-y px-3 py-2 leading-relaxed", className)}
      {...props}
    />
  );
}

export { Textarea };
