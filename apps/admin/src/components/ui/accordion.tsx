"use client";

import * as React from "react";
import {
  Accordion as UiAccordion,
  AccordionHeader,
  AccordionItem as UiAccordionItem,
  AccordionPanel,
  AccordionTrigger as UiAccordionTrigger,
} from "@ui-sdk/react/accordion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

function Accordion({ className, ...props }: React.ComponentProps<typeof UiAccordion>) {
  return <UiAccordion className={cn("w-full divide-y divide-border border-y border-border", className)} {...props} />;
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof UiAccordionItem>) {
  return <UiAccordionItem className={cn("border-0", className)} {...props} />;
}

function AccordionTrigger({ className, children, ...props }: Omit<React.ComponentProps<typeof UiAccordionTrigger>, "children"> & { children?: React.ReactNode }) {
  return (
    <AccordionHeader className="m-0">
      <UiAccordionTrigger
        className={cn(
          "group/trigger flex w-full items-center justify-between gap-4 border-0 bg-transparent py-4 text-left text-[15px] font-medium tracking-[-0.01em] text-foreground transition-colors hover:text-foreground/80",
          className
        )}
        {...props}
      >
        {children}
        <Plus aria-hidden="true" className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[open]/trigger:rotate-45" />
      </UiAccordionTrigger>
    </AccordionHeader>
  );
}

function AccordionContent({ className, ...props }: React.ComponentProps<typeof AccordionPanel>) {
  return <AccordionPanel className={cn("pb-4 text-sm leading-relaxed text-muted-foreground", className)} {...props} />;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
