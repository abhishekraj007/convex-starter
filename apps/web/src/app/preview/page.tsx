"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CustomerGrowth } from "@/components/dashboard/customer-growth";
import { CustomerHabits } from "@/components/dashboard/customer-habits";
import { ProductStatistic } from "@/components/dashboard/product-statistic";
import { SummaryCards } from "@/components/dashboard/summary-cards";

export default function SalesReportPreviewPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[30px] leading-[1.05] font-extrabold tracking-[-0.045em] sm:text-[34px]">Sales Report</h1>
          <p className="mt-1.5 text-[13px] font-medium text-muted-foreground">Friday, December 15th 2023</p>
        </div>
        <Button variant="secondary" size="sm" shape="pill" className="gap-2 px-3.5">
          <Download />
          Export
        </Button>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="grid gap-4">
          <SummaryCards />
          <CustomerHabits />
        </div>
        <div className="flex flex-col gap-4">
          <ProductStatistic />
          <CustomerGrowth />
        </div>
      </div>
    </div>
  );
}
