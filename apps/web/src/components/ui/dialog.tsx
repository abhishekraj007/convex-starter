"use client";

import * as React from "react";
import {
  Dialog as UiDialog,
  DialogBackdrop,
  DialogClose as UiDialogClose,
  DialogContent as UiDialogContent,
  DialogDescription as UiDialogDescription,
  DialogTitle as UiDialogTitle,
  DialogTrigger as UiDialogTrigger,
} from "@ui-sdk/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Dialog({ ...props }: React.ComponentProps<typeof UiDialog>) {
  return <UiDialog {...props} />;
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof UiDialogTrigger>) {
  return <UiDialogTrigger {...props} />;
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof UiDialogClose>) {
  return <UiDialogClose {...props} />;
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: Omit<React.ComponentProps<typeof UiDialogContent>, "children"> & {
  children?: React.ReactNode;
  showCloseButton?: boolean;
}) {
  return (
    <>
      <DialogBackdrop className="bg-[oklch(0.22_0.03_278/0.4)] backdrop-blur-[2px] dark:bg-[oklch(0.06_0.02_278/0.7)]" />
      <UiDialogContent
        className={cn(
          "gap-4 rounded-xl border-border bg-popover text-popover-foreground p-6 shadow-lg sm:max-w-lg",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton ? (
          <UiDialogClose
            aria-label="Close"
            className="absolute top-4 right-4 size-7 rounded-xs border-0 bg-transparent p-0 opacity-70 transition-opacity hover:bg-accent hover:opacity-100"
          >
            <XIcon className="size-4" />
          </UiDialogClose>
        ) : null}
      </UiDialogContent>
    </>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 pe-8 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof UiDialogTitle>) {
  return (
    <UiDialogTitle
      className={cn("text-lg leading-tight font-semibold", className)}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof UiDialogDescription>) {
  return (
    <UiDialogDescription
      className={cn("mt-0 text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
