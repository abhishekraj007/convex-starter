"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import {
  Combobox,
  ComboboxContent as UiComboboxContent,
  ComboboxEmpty as UiComboboxEmpty,
  ComboboxInput as UiComboboxInput,
  ComboboxItem as UiComboboxItem,
  ComboboxItemIndicator,
  ComboboxList,
  ComboboxTrigger,
} from "@ui-sdk/react/combobox";

import { cn } from "@/lib/utils";
import { fieldStyles } from "./field-styles";

/** Text input + trigger in one field, styled like Input. */
function ComboboxField({ className, placeholder, ...props }: React.ComponentProps<typeof UiComboboxInput>) {
  return (
    <div className="relative w-full">
      <UiComboboxInput placeholder={placeholder} className={cn(fieldStyles, "h-9 pr-9 pl-3", className)} {...props} />
      <ComboboxTrigger
        aria-label="Show options"
        className="absolute top-1/2 right-1.5 flex size-6 -translate-y-1/2 items-center justify-center rounded-md text-faint-foreground hover:bg-accent hover:text-foreground"
      >
        <ChevronsUpDown className="size-3.5" />
      </ComboboxTrigger>
    </div>
  );
}

function ComboboxContent({ className, children, ...props }: React.ComponentProps<typeof UiComboboxContent>) {
  return (
    <UiComboboxContent
      sideOffset={6}
      className={cn("surface-float z-50 max-h-72 w-(--anchor-width) min-w-48 overflow-y-auto rounded-xl p-1", className)}
      {...props}
    >
      <ComboboxList>{children}</ComboboxList>
    </UiComboboxContent>
  );
}

function ComboboxItem({ className, children, ...props }: Omit<React.ComponentProps<typeof UiComboboxItem>, "children"> & { children?: React.ReactNode }) {
  return (
    <UiComboboxItem
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-[13px] outline-none select-none data-disabled:opacity-50 data-highlighted:bg-accent",
        className
      )}
      {...props}
    >
      {children}
      <ComboboxItemIndicator className="absolute right-2 flex items-center">
        <CheckIcon className="size-3.5" />
      </ComboboxItemIndicator>
    </UiComboboxItem>
  );
}

function ComboboxEmpty({ className, ...props }: React.ComponentProps<typeof UiComboboxEmpty>) {
  return <UiComboboxEmpty className={cn("px-2 py-6 text-center text-[13px] text-muted-foreground", className)} {...props} />;
}

export { Combobox, ComboboxField, ComboboxContent, ComboboxItem, ComboboxEmpty };
