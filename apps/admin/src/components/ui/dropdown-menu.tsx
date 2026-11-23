"use client";

import * as React from "react";
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroup,
  MenuItem,
  MenuItemIndicator,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@ui-sdk/react/menu";
import { CircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function DropdownMenu({ ...props }: React.ComponentProps<typeof Menu>) {
  return <Menu {...props} />;
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof MenuTrigger>) {
  return <MenuTrigger {...props} />;
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof MenuContent>) {
  return (
    <MenuContent
      sideOffset={sideOffset}
      className={cn(
        "surface-float z-50 min-w-[10rem] rounded-xl p-1",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof MenuGroup>) {
  return <MenuGroup {...props} />;
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: React.ComponentProps<typeof MenuItem> & {
  inset?: boolean;
  variant?: "default" | "destructive";
}) {
  return (
    <MenuItem
      destructive={variant === "destructive"}
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-[13px] outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground data-destructive:text-destructive data-destructive:data-highlighted:bg-destructive/10 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuCheckboxItem({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof MenuCheckboxItem>, "children"> & {
  children?: React.ReactNode;
}) {
  return (
    <MenuCheckboxItem
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-[13px] outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuItemIndicator />
      </span>
      {children}
    </MenuCheckboxItem>
  );
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof MenuRadioGroup>) {
  return <MenuRadioGroup {...props} />;
}

function DropdownMenuRadioItem({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof MenuRadioItem>, "children"> & {
  children?: React.ReactNode;
}) {
  return (
    <MenuRadioItem
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-md py-1.5 pr-2 pl-8 text-[13px] outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-50 data-highlighted:bg-accent data-highlighted:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-muted-foreground",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
        <MenuItemIndicator>
          <CircleIcon className="size-2 fill-current" />
        </MenuItemIndicator>
      </span>
      {children}
    </MenuRadioItem>
  );
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & {
  inset?: boolean;
}) {
  return (
    <div
      data-slot="menu-label"
      className={cn(
        "px-2 pt-1.5 pb-1 text-xs font-medium text-muted-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenuSeparator>) {
  return (
    <MenuSeparator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({
  className,
  ...props
}: React.ComponentProps<typeof MenuShortcut>) {
  return (
    <MenuShortcut
      className={cn("ml-auto font-mono text-[11px] tracking-wide text-faint-foreground", className)}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: React.ComponentProps<typeof MenuSub>) {
  return <MenuSub {...props} />;
}

function DropdownMenuSubTrigger({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenuSubTrigger> & {
  inset?: boolean;
}) {
  return (
    <MenuSubTrigger
      className={cn(
        "flex cursor-default items-center rounded-md px-2 py-1.5 text-[13px] outline-none select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  );
}

function DropdownMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenuSubContent>) {
  return (
    <MenuSubContent
      className={cn(
        "surface-float z-50 min-w-[10rem] overflow-hidden rounded-xl p-1",
        className
      )}
      {...props}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
