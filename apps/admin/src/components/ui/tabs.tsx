"use client";

import * as React from "react";
import { Tabs as UiTabs, TabsList as UiTabsList, TabsPanel as UiTabsPanel, TabsTab as UiTabsTab } from "@ui-sdk/react/tabs";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: React.ComponentProps<typeof UiTabs>) {
  return <UiTabs className={cn("flex flex-col gap-4", className)} {...props} />;
}

/** `variant="pills"` = segmented pill row (Linear), `"line"` = underline tabs (Vercel). */
function TabsList({
  className,
  variant = "pills",
  ...props
}: React.ComponentProps<typeof UiTabsList> & { variant?: "pills" | "line" }) {
  return (
    <UiTabsList
      data-variant={variant}
      className={cn(
        "group/tabs",
        variant === "pills" && "w-fit gap-0.5 rounded-lg border-0 bg-muted p-0.5",
        variant === "line" && "gap-4 border-b border-border",
        className
      )}
      {...props}
    />
  );
}

function TabsTab({ className, ...props }: React.ComponentProps<typeof UiTabsTab>) {
  return (
    <UiTabsTab
      className={cn(
        "h-8 gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground [&_svg]:size-3.5",
        "group-data-[variant=pills]/tabs:mb-0 group-data-[variant=pills]/tabs:rounded-md group-data-[variant=pills]/tabs:border-0 group-data-[variant=pills]/tabs:px-3 group-data-[variant=pills]/tabs:data-selected:bg-card group-data-[variant=pills]/tabs:data-selected:text-foreground group-data-[variant=pills]/tabs:data-selected:shadow-[inset_0_1px_0_var(--highlight),var(--elev-1)]",
        "group-data-[variant=line]/tabs:px-0.5 group-data-[variant=line]/tabs:data-selected:border-foreground group-data-[variant=line]/tabs:data-selected:text-foreground",
        className
      )}
      {...props}
    />
  );
}

function TabsPanel({ className, ...props }: React.ComponentProps<typeof UiTabsPanel>) {
  return <UiTabsPanel className={cn("outline-none", className)} {...props} />;
}

export { Tabs, TabsList, TabsTab, TabsPanel };
