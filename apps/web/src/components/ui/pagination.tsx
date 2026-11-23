"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Pagination as UiPagination,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@ui-sdk/react/pagination";

import { cn } from "@/lib/utils";

const cell =
  "flex h-8 min-w-8 items-center justify-center gap-1 rounded-md px-2 text-[13px] text-muted-foreground tabular-nums transition-colors hover:bg-accent hover:text-foreground aria-[current=page]:bg-card aria-[current=page]:font-medium aria-[current=page]:text-foreground aria-[current=page]:shadow-[inset_0_1px_0_var(--highlight),0_0_0_1px_var(--border),var(--elev-1)] data-disabled:pointer-events-none data-disabled:opacity-40 aria-disabled:pointer-events-none aria-disabled:opacity-40";

/** Compact numbered pagination; the current page is a raised chip. */
function Pagination({ className, ...props }: Omit<React.ComponentProps<typeof UiPagination>, "children">) {
  return (
    <UiPagination className={cn("w-fit", className)} {...props}>
      <PaginationList className="flex items-center gap-0.5">
        {({ items }: { items: (number | string)[] }) => (
          <>
            <PaginationItem>
              <PaginationPrevious className={cell}>
                <ChevronLeft className="size-3.5" /> Prev
              </PaginationPrevious>
            </PaginationItem>
            {items.map((item) =>
              typeof item === "number" ? (
                <PaginationItem key={item}>
                  <PaginationLink page={item} className={cell}>
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ) : (
                <PaginationItem key={item}>
                  <PaginationEllipsis className="flex h-8 w-6 items-center justify-center text-faint-foreground">…</PaginationEllipsis>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext className={cell}>
                Next <ChevronRight className="size-3.5" />
              </PaginationNext>
            </PaginationItem>
          </>
        )}
      </PaginationList>
    </UiPagination>
  );
}

export { Pagination };
