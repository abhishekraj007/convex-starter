"use client";

import type { LucideIcon } from "lucide-react";

import { IconTile } from "@/components/ui/icon-tile";

interface StatCardProps {
  label: string;
  value: number;
  caption: string;
  icon: LucideIcon;
}

export function StatCard({ label, value, caption, icon: Icon }: StatCardProps) {
  return (
    <div className="surface rounded-3xl p-5 sm:p-6">
      <IconTile tone="muted">
        <Icon />
      </IconTile>
      <p className="mt-5 text-[12.5px] font-semibold text-muted-foreground">{label}</p>
      <p className="stat-figure mt-1 text-[2.35rem]">{value.toLocaleString("en-US")}</p>
      <p className="mt-1 text-[11.5px] text-muted-foreground">{caption}</p>
    </div>
  );
}
