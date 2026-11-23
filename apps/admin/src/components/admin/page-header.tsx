"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-[1.5rem] leading-tight font-semibold tracking-[-0.03em]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-[13.5px] text-muted-foreground">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex w-full flex-col gap-1.5 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  );
}

