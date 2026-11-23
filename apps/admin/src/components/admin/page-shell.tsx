"use client";

import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-8 sm:py-8",
        className,
      )}
    >
      {children}
    </div>
  );
}

