"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Coins, Crown, HardDrive, Upload } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { IconTile } from "@/components/ui/icon-tile";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatBytes } from "@/lib/format";

type MetricProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
  isLoading: boolean;
  badge?: ReactNode;
  className?: string;
  children?: ReactNode;
};

function MetricCard({ icon: Icon, label, value, caption, isLoading, badge, className, children }: MetricProps) {
  return (
    <div className={cn("surface flex min-h-[160px] flex-col rounded-3xl p-4 sm:min-h-[170px] sm:p-5", className)}>
      <div className="flex items-start justify-between gap-2">
        <IconTile tone="muted">
          <Icon />
        </IconTile>
        {badge}
      </div>
      <p className="mt-5 text-[12px] font-semibold text-muted-foreground">{label}</p>
      {isLoading ? (
        <Skeleton className="mt-2 h-8 w-24 rounded-lg" />
      ) : (
        <p className="stat-figure mt-1 text-[1.6rem] sm:text-[1.85rem]">{value}</p>
      )}
      <p className="mt-1 text-[11px] text-muted-foreground">{caption}</p>
      {children}
    </div>
  );
}

export function SummaryCards({
  isLoading,
  credits,
  isPremium,
  uploadCount,
  storageBytes,
  storageQuota,
  storagePercent,
}: {
  isLoading: boolean;
  credits: number;
  isPremium: boolean;
  uploadCount: number;
  storageBytes: number;
  storageQuota: number;
  storagePercent: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
      <div className="relative flex min-h-[160px] flex-col overflow-hidden rounded-3xl bg-primary p-4 text-primary-foreground sm:min-h-[170px] sm:p-5 shadow-[0_18px_40px_-24px_color-mix(in_oklab,var(--brand)_85%,transparent)]">
        <div aria-hidden="true" className="pointer-events-none absolute -top-14 -right-8 size-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-start justify-between gap-2">
          <IconTile tone="inverse" className="bg-white/16 text-white">
            <Coins />
          </IconTile>
          {isLoading ? (
            <span className="h-5 w-10 animate-pulse rounded-full bg-white/20" />
          ) : (
            <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em]">
              {isPremium ? "PRO" : "FREE"}
            </span>
          )}
        </div>
        <p className="relative mt-5 text-[12px] font-semibold text-white/90">Credits available</p>
        {isLoading ? (
          <span className="relative mt-2 block h-8 w-28 animate-pulse rounded-lg bg-white/20" />
        ) : (
          <p className="stat-figure relative mt-1 text-[1.6rem] sm:text-[1.85rem]">{credits.toLocaleString("en-US")}</p>
        )}
        <p className="relative mt-1 text-[11px] text-white/90">
          {isPremium ? "Included with your Pro plan" : "Starter balance"}
        </p>
      </div>

      <MetricCard
        icon={Crown}
        label="Plan"
        value={isPremium ? "Pro" : "Free"}
        caption={isPremium ? "Premium access active" : "No active subscription"}
        isLoading={isLoading}
        badge={
          isLoading ? (
            <Skeleton className="h-5 w-12 rounded-full" />
          ) : isPremium ? (
            <Badge variant="success">Active</Badge>
          ) : undefined
        }
      />

      <MetricCard
        icon={Upload}
        label="Uploads"
        value={uploadCount.toLocaleString("en-US")}
        caption="Images stored in your workspace"
        isLoading={isLoading}
      />

      <MetricCard
        icon={HardDrive}
        label="Storage"
        value={formatBytes(storageBytes)}
        caption={`of ${formatBytes(storageQuota)} used`}
        isLoading={isLoading}
        badge={
          isLoading ? <Skeleton className="h-5 w-10 rounded-full" /> : <Badge variant="secondary">{storagePercent}%</Badge>
        }
      >
        <div className="mt-auto pt-3">
          <div
            role="progressbar"
            aria-label="Storage used"
            aria-valuenow={storagePercent}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div className="h-full rounded-full bg-brand" style={{ width: `${storagePercent}%` }} />
          </div>
        </div>
      </MetricCard>
    </div>
  );
}
