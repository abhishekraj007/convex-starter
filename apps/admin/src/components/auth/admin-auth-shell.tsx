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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className={cn("w-full max-w-md", className)}>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <header className="space-y-2 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
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
      className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
    >
      {message}
    </p>
  );
}
