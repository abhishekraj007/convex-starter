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
    <UiPasswordInput
      className={cn(
        "h-9 w-full rounded-md border-input bg-transparent ps-3 pe-1 shadow-xs transition-[color,box-shadow] has-[:focus-visible]:border-ring has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring has-[:disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <PasswordInputControl
        id={controlId}
        className="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm" />
      <PasswordInputToggle
        aria-label="Show password"
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
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
