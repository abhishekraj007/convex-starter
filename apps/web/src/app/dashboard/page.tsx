"use client";

import { ProtectedRoute } from "@/components/protected-route";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardHeader } from "@/components/dashboard-home/page-header";
import { GettingStarted } from "@/components/dashboard-home/getting-started";
import { PlanCard } from "@/components/dashboard-home/plan-card";
import { QuickActions } from "@/components/dashboard-home/quick-actions";
import { RecentUploads } from "@/components/dashboard-home/recent-uploads";
import { SummaryCards } from "@/components/dashboard-home/summary-cards";
import { useDashboardOverview } from "@/hooks/use-dashboard-overview";

export default function DashboardPage() {
  const overview = useDashboardOverview();

  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <DashboardHeader firstName={overview.firstName} />

        <div className="mt-6">
          <SummaryCards
            isLoading={overview.isLoading}
            credits={overview.credits}
            isPremium={overview.isPremium}
            uploadCount={overview.uploadCount}
            storageBytes={overview.storageBytes}
            storageQuota={overview.storageQuota}
            storagePercent={overview.storagePercent}
          />
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="grid gap-4">
            <RecentUploads uploads={overview.recentUploads} uploadCount={overview.uploadCount} isLoading={overview.isLoading} />
            <GettingStarted uploadCount={overview.uploadCount} isPremium={overview.isPremium} />
          </div>
          <div className="flex flex-col gap-4">
            <QuickActions />
            {overview.isLoading ? (
              <Skeleton className="min-h-60 flex-1 rounded-3xl" />
            ) : (
              <PlanCard isPremium={overview.isPremium} />
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
