"use client";

import * as React from "react";
import type { SelectProps } from "@ui-sdk/react/select";
import {
  Select as UiSelect,
  SelectContent as UiSelectContent,
  SelectGroup as UiSelectGroup,
  SelectItem as UiSelectItem,
  SelectItemIndicator,
  SelectLabel as UiSelectLabel,
  SelectSeparator as UiSelectSeparator,
  SelectTrigger as UiSelectTrigger,
  SelectValue as UiSelectValue,
} from "@ui-sdk/react/select";
import { CheckIcon, ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SingleSelectProps = Omit<
  SelectProps<string, false>,
  "multiple" | "value" | "defaultValue" | "onValueChange"
> & {
  multiple?: false;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};

function Select({ ...props }: SingleSelectProps) {
  return <UiSelect<string, false> {...props} />;
}

function SelectGroup({ ...props }: React.ComponentProps<typeof UiSelectGroup>) {
  return <UiSelectGroup {...props} />;
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof UiSelectValue>) {
  return <UiSelectValue {...props} />;
}

function SelectTrigger({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof UiSelectTrigger>, "children"> & { children?: React.ReactNode }) {
  return (
    <UiSelectTrigger
      className={cn(
        "flex h-10 w-fit items-center justify-between gap-2 rounded-xl border border-input bg-card px-3.5 py-2 text-sm whitespace-nowrap shadow-[0_1px_2px_color-mix(in_oklab,var(--shadow-color)_5%,transparent)] transition-[border-color,box-shadow,background-color] hover:border-border-strong data-open:border-ring data-open:shadow-[0_0_0_4px_color-mix(in_oklab,var(--ring)_18%,transparent)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children ?? <SelectValue />}
      <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
    </UiSelectTrigger>
  );
}

function SelectContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof UiSelectContent>) {
  return (
    <UiSelectContent
      className={cn(
        "surface-float z-50 max-h-(--available-height) min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-2xl p-1.5",
        className
      )}
      {...props}
    >
      {children}
    </UiSelectContent>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof UiSelectLabel>) {
  return (
    <UiSelectLabel
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof UiSelectItem>, "children"> & { children?: React.ReactNode }) {
  return (
    <UiSelectItem
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-md py-1.5 pr-8 pl-2 text-[13px] outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      <SelectItemIndicator className="absolute right-2 flex size-3.5 items-center justify-center">
        <CheckIcon className="size-4" />
      </SelectItemIndicator>
      {children}
    </UiSelectItem>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof UiSelectSeparator>) {
  return (
    <UiSelectSeparator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
