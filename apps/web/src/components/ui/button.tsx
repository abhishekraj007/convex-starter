"use client";

import * as React from "react";
import { Button as UiButton } from "@ui-sdk/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/*
 * Buttons: a single indigo for committing actions, floating white surfaces for
 * secondary controls, quiet ghost for toolbars. Every variant presses down 1px.
 */
const buttonVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-semibold tracking-[-0.01em] select-none transition-[background-color,border-color,color,box-shadow,transform,opacity] duration-150 ease-out outline-none active:translate-y-px disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--primary)_45%,transparent),0_8px_20px_-10px_color-mix(in_oklab,var(--primary)_75%,transparent)] hover:bg-[color-mix(in_oklab,var(--primary)_88%,var(--foreground))]",
        brand:
          "border-transparent bg-brand text-brand-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--brand)_45%,transparent),0_10px_24px_-10px_color-mix(in_oklab,var(--brand)_80%,transparent)] hover:bg-[color-mix(in_oklab,var(--brand)_88%,var(--foreground))]",
        soft: "border-transparent bg-brand-soft text-brand-text hover:bg-brand/15",
        secondary:
          "border-transparent bg-card text-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--shadow-color)_6%,transparent)] hover:bg-card hover:shadow-[var(--elev-2)]",
        outline:
          "border-border-strong bg-transparent text-foreground hover:bg-accent",
        ghost:
          "border-transparent bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--destructive)_40%,transparent),0_8px_20px_-10px_color-mix(in_oklab,var(--destructive)_70%,transparent)] hover:bg-[color-mix(in_oklab,var(--destructive)_88%,var(--foreground))]",
        "destructive-soft":
          "border-transparent bg-destructive/10 text-destructive-text hover:bg-destructive/15",
        link: "h-auto border-transparent bg-transparent px-0 text-brand-text underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-7 gap-1.5 rounded-lg px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 rounded-lg px-3 text-[13px]",
        default: "h-9 px-3.5",
        lg: "h-10 px-4",
        xl: "h-11 rounded-2xl px-5 text-[15px]",
        icon: "size-9",
        "icon-sm": "size-8 rounded-lg",
        "icon-xs": "size-7 rounded-lg",
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
