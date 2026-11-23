"use client";

import * as React from "react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@ui-sdk/react/drawer";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SheetSide = "top" | "right" | "bottom" | "left";

const SheetSideContext = React.createContext<SheetSide>("right");

function Sheet({
  side = "right",
  children,
  ...props
}: React.ComponentProps<typeof Drawer> & { side?: SheetSide }) {
  return (
    <SheetSideContext value={side}>
      <Drawer side={side} {...props}>
        {children}
      </Drawer>
    </SheetSideContext>
  );
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof DrawerTrigger>) {
  return <DrawerTrigger {...props} />;
}

function SheetClose({ ...props }: React.ComponentProps<typeof DrawerClose>) {
  return <DrawerClose {...props} />;
}

function SheetContent({
  className,
  children,
  side,
  ...props
}: Omit<React.ComponentProps<typeof DrawerContent>, "children"> & {
  children?: React.ReactNode;
  side?: SheetSide;
}) {
  const rootSide = React.useContext(SheetSideContext);
  const resolvedSide = side ?? rootSide;

  return (
    <>
      <DrawerBackdrop className="bg-[oklch(0.22_0.03_278/0.4)] backdrop-blur-[2px] dark:bg-[oklch(0.06_0.02_278/0.7)]" />
      <DrawerContent
        className={cn(
          "gap-4 border-border bg-popover text-popover-foreground p-0 shadow-lg",
          resolvedSide === "left" || resolvedSide === "right" ? "sm:max-w-sm" : "",
          className
        )}
        {...props}
      >
        {children}
        <DrawerClose
          aria-label="Close"
          className="absolute top-4 right-4 size-7 rounded-xs border-0 bg-transparent p-0 opacity-70 transition-opacity hover:bg-accent hover:opacity-100"
        >
          <XIcon className="size-4" />
        </DrawerClose>
      </DrawerContent>
    </>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("flex flex-col gap-1.5 p-4", className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerTitle>) {
  return (
    <DrawerTitle
      className={cn("font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerDescription>) {
  return (
    <DrawerDescription
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
