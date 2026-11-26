"use client";

import * as React from "react";
import {
  Command as UiCommand,
  CommandEmpty as UiCommandEmpty,
  CommandGroup as UiCommandGroup,
  CommandGroupLabel as UiCommandGroupLabel,
  CommandInput as UiCommandInput,
  CommandItem as UiCommandItem,
  CommandItemIcon as UiCommandItemIcon,
  CommandItemText as UiCommandItemText,
  CommandList as UiCommandList,
  CommandSeparator as UiCommandSeparator,
  CommandShortcut as UiCommandShortcut,
} from "@ui-sdk/react/command";

import { cn } from "@/lib/utils";

function Command({ className, ...props }: React.ComponentProps<typeof UiCommand>) {
  return <UiCommand className={cn("flex w-full flex-col rounded-none border-0 bg-transparent text-[13px] text-foreground", className)} {...props} />;
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof UiCommandInput>) {
  return (
    <UiCommandInput
      className={cn("h-11 w-full border-0 bg-transparent px-0 text-[15px] outline-none placeholder:text-faint-foreground", className)}
      {...props}
    />
  );
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof UiCommandEmpty>) {
  return <UiCommandEmpty className={cn("px-4 py-10 text-center text-[13px] text-muted-foreground empty:hidden", className)} {...props} />;
}

function CommandList({ className, ...props }: React.ComponentProps<typeof UiCommandList>) {
  return <UiCommandList className={cn("max-h-[min(28rem,58vh)] overflow-y-auto p-2", className)} {...props} />;
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof UiCommandGroup>) {
  return <UiCommandGroup className={cn("p-0", className)} {...props} />;
}

function CommandGroupLabel({ className, ...props }: React.ComponentProps<typeof UiCommandGroupLabel>) {
  return (
    <UiCommandGroupLabel
      className={cn("px-2.5 pt-3 pb-1.5 text-[10px] font-semibold tracking-[0.14em] uppercase text-faint-foreground", className)}
      {...props}
    />
  );
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof UiCommandItem>) {
  return (
    <UiCommandItem
      className={cn(
        "flex min-h-9 items-center gap-2.5 rounded-xl px-2.5 py-2 text-[13px] font-medium outline-none select-none data-highlighted:bg-accent data-highlighted:text-foreground data-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

function CommandItemIcon({ className, ...props }: React.ComponentProps<typeof UiCommandItemIcon>) {
  return <UiCommandItemIcon className={cn("shrink-0 text-faint-foreground [&_svg]:size-4", className)} {...props} />;
}

function CommandItemText({ className, ...props }: React.ComponentProps<typeof UiCommandItemText>) {
  return <UiCommandItemText className={cn("min-w-0 flex-1 truncate", className)} {...props} />;
}

function CommandShortcut({ className, ...props }: React.ComponentProps<typeof UiCommandShortcut>) {
  return <UiCommandShortcut className={cn("ml-auto text-[10px] tracking-[0.04em] text-faint-foreground", className)} {...props} />;
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof UiCommandSeparator>) {
  return <UiCommandSeparator className={cn("my-1.5 h-px bg-border", className)} {...props} />;
}

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandItemText,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
