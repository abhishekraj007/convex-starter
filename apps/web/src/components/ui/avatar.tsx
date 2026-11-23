"use client";

import * as React from "react";
import {
  Avatar as UiAvatar,
  AvatarFallback as UiAvatarFallback,
  AvatarImage as UiAvatarImage,
} from "@ui-sdk/react/avatar";

import { cn } from "@/lib/utils";

function Avatar({ className, ...props }: React.ComponentProps<typeof UiAvatar>) {
  return (
    <UiAvatar
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-border",
        className
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof UiAvatarImage>) {
  return (
    <UiAvatarImage
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof UiAvatarFallback>) {
  return (
    <UiAvatarFallback
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
