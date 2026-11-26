"use client";

import * as React from "react";
import {
  Popover,
  PopoverClose,
  PopoverContent as UiPopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "@ui-sdk/react/popover";

import { cn } from "@/lib/utils";

function PopoverContent({ className, ...props }: React.ComponentProps<typeof UiPopoverContent>) {
  return <UiPopoverContent className={cn("w-80 rounded-xl p-4 text-sm", className)} {...props} />;
}

export { Popover, PopoverTrigger, PopoverContent, PopoverTitle, PopoverDescription, PopoverClose };
