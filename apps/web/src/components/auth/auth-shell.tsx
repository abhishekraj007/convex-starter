"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/brand-mark";

export function AuthShell({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative isolate flex min-h-[calc(100svh-3.5rem)] items-center justify-center overflow-hidden px-4 py-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-grid [mask-image:radial-gradient(50%_50%_at_50%_40%,black,transparent)]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-[-200px] left-1/2 -z-10 h-[460px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_14%,transparent),transparent)]" />
      <Card className={cn("w-full max-w-[400px] rounded-2xl py-0 shadow-[inset_0_1px_0_var(--highlight),var(--elev-3)]", className)}>
        <CardContent className="space-y-6 p-7 sm:p-8">
          <header className="space-y-2 text-center">
            <BrandMark className="mx-auto mb-4 size-9" />
            <h1 className="text-[1.625rem] leading-tight font-semibold tracking-[-0.035em]">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </header>
          {children}
        </CardContent>
      </Card>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-destructive/25 bg-destructive/[0.07] px-3 py-2 text-[13px] text-destructive-text"
    >
      {message}
    </p>
  );
}
