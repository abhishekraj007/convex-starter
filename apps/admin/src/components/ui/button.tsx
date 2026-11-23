"use client";

import * as React from "react";
import { Button as UiButton } from "@ui-sdk/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Buttons: inverse-neutral primary with a soft top-lit gradient and inset highlight,
 * hairline secondary on the card surface, quiet ghost. Every variant presses down 1px.
 */
const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg border text-sm font-medium tracking-[-0.01em] select-none transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-150 ease-out outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground bg-[linear-gradient(180deg,color-mix(in_oklab,var(--primary-foreground)_14%,transparent),transparent_60%)] shadow-[inset_0_1px_0_color-mix(in_oklab,var(--primary-foreground)_18%,transparent),0_0_0_1px_var(--primary),var(--elev-1)] hover:bg-[color-mix(in_oklab,var(--primary)_88%,var(--primary-foreground))]",
        brand:
          "border-transparent bg-brand text-brand-foreground bg-[linear-gradient(180deg,oklch(1_0_0/0.16),transparent_60%)] shadow-[inset_0_1px_0_oklch(1_0_0/0.22),0_0_0_1px_color-mix(in_oklab,var(--brand)_80%,black),0_4px_14px_-4px_color-mix(in_oklab,var(--brand)_60%,transparent)] hover:brightness-110",
        secondary:
          "border-border bg-card text-foreground shadow-[inset_0_1px_0_var(--highlight),var(--elev-1)] hover:border-border-strong hover:bg-accent",
        outline:
          "border-border-strong bg-transparent text-foreground hover:bg-accent",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.18),var(--elev-1)] hover:brightness-110",
        "destructive-soft":
          "border-destructive/20 bg-destructive/10 text-destructive-text hover:bg-destructive/15",
        link: "h-auto border-transparent bg-transparent px-0 text-brand-text underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 gap-1.5 rounded-md px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-md px-3 text-[13px]",
        default: "h-9 px-3.5",
        lg: "h-10 px-4",
        xl: "h-11 rounded-xl px-5 text-[15px]",
        icon: "size-9",
        "icon-sm": "size-8 rounded-md",
        "icon-xs": "size-7 rounded-md",
      },
      shape: {
        default: "",
        pill: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
    },
  }
);

type ButtonProps = React.ComponentProps<typeof UiButton> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, shape, ...props }: ButtonProps) {
  return (
    <UiButton
      className={cn(buttonVariants({ variant, size, shape, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
