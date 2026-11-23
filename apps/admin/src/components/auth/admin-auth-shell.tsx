"use client";

import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function AdminAuthShell({
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
    <div className="relative isolate flex min-h-screen items-center justify-center bg-background p-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(color-mix(in_oklab,var(--foreground)_9%,transparent)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(60%_60%_at_50%_45%,black,transparent)]"
      />
      <Card className={cn("w-full max-w-md shadow-lg", className)}>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <header className="space-y-2 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
              <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">
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

export function AdminFormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-text"
    >
      {message}
    </p>
  );
}
