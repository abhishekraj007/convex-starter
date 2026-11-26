"use client";

import Link from "next/link";
import { BookOpen, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function DashboardHeader({ firstName }: { firstName?: string }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="eyebrow">Overview</p>
        <h1 className="mt-2 text-[30px] leading-[1.05] font-extrabold tracking-[-0.045em] sm:text-[34px]">
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Your plan, credits and recent work at a glance.</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" shape="pill" render={<Link href="/docs" />}>
          <BookOpen />
          Docs
        </Button>
        <Button size="sm" shape="pill" render={<Link href="/assistant" />}>
          <Sparkles />
          Open AI assistant
        </Button>
      </div>
    </header>
  );
}
