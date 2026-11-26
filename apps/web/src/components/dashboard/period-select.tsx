"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export function PeriodSelect({
  defaultValue = "today",
  items = [
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
    { value: "year", label: "This year" },
  ],
  className,
  label = "Time period",
}: {
  defaultValue?: string;
  items?: { value: string; label: string }[];
  className?: string;
  label?: string;
}) {
  return (
    <Select defaultValue={defaultValue}>
      <SelectTrigger
        aria-label={label}
        className={cn(
          "h-8 w-auto min-w-0 shrink-0 gap-1.5 rounded-full border-transparent bg-muted px-3 text-[12px] font-semibold text-muted-foreground shadow-none hover:bg-accent hover:text-foreground data-open:border-transparent data-open:shadow-none",
          className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end" className="min-w-40">
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
