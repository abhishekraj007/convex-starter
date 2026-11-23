"use client";

import * as React from "react";
import {
  PasswordInput as UiPasswordInput,
  PasswordInputControl,
  PasswordInputToggle,
} from "@ui-sdk/react/password-input";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

type PasswordInputProps = React.ComponentProps<typeof UiPasswordInput> & {
  controlId?: string;
};

function PasswordInput({ className, controlId, ...props }: PasswordInputProps) {
  return (
    <UiPasswordInput className={cn("relative", className)} {...props}>
      <PasswordInputControl
        id={controlId}
        className="flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 pr-10 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" />
      <PasswordInputToggle
        aria-label="Show password"
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {(state) =>
          state.visible ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )
        }
      </PasswordInputToggle>
    </UiPasswordInput>
  );
}

export { PasswordInput };
