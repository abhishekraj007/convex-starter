"use client";

import * as React from "react";
import {
  OTPInput as UiOTPInput,
  OTPInputGroup,
  OTPInputSlot,
} from "@ui-sdk/react/otp-input";

import { cn } from "@/lib/utils";

type OTPInputProps = React.ComponentProps<typeof UiOTPInput>;

function OTPInput({ className, maxLength = 6, ...props }: OTPInputProps) {
  return (
    <UiOTPInput
      maxLength={maxLength}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      <OTPInputGroup className="flex items-center gap-2">
        {Array.from({ length: maxLength }, (_, index) => (
          <OTPInputSlot
            key={index}
            index={index}
            className="flex size-11 items-center justify-center rounded-md border border-input bg-transparent text-lg font-medium shadow-xs data-[active]:border-ring data-[active]:ring-[3px] data-[active]:ring-ring/30"
          />
        ))}
      </OTPInputGroup>
    </UiOTPInput>
  );
}

export { OTPInput };
