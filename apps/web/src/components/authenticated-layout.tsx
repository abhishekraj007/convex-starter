"use client";

import { useQuery } from "convex/react";
import { api } from "@convex-starter/backend/convex/_generated/api";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/components/mode-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { CreditsModal } from "@/components/credits-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Coins } from "lucide-react";
import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = useQuery(api.user.fetchUserAndProfile);
  const userCredits = useQuery(api.features.credits.queries.getUserCredits);
  const premiumStatus = useQuery(api.features.premium.queries.isPremium);
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);
  const router = useRouter();
  const t = useTranslations("common");

  const pathname = usePathname();
  const isLoading = userData === undefined && !pathname?.startsWith("/preview");
  const segment = pathname?.split("/").filter(Boolean)[0] ?? "home";
  const pageTitle = segment === "preview" ? "Dashboard" : segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-20 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-xl md:px-4">
            <SidebarTrigger className="-ml-1 text-muted-foreground" />
            <Separator orientation="vertical" className="mr-1 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden sm:inline-flex">
                  <BreadcrumbLink href="/">Convex Starter</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden sm:inline-flex" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="hidden lg:block">
                <LocaleSwitcher compact />
              </div>
              <ModeToggle />
              {isLoading ? (
                <Skeleton className="hidden h-8 w-24 rounded-full sm:block" />
              ) : (
                !premiumStatus?.isPremium && (
                  <Button variant="brand" size="sm" shape="pill" onClick={() => router.push("/pricing")} className="hidden sm:inline-flex">
                    {t("upgrade")}
                  </Button>
                )
              )}
              {isLoading ? (
                <Skeleton className="h-8 w-16 rounded-full" />
              ) : (
                <Button variant="secondary" size="sm" shape="pill" onClick={() => setCreditsModalOpen(true)}>
                  <Coins />
                  <span className="tabular-nums">{userCredits?.credits ?? 0}</span>
                </Button>
              )}
            </div>
          </header>
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <CreditsModal
        open={creditsModalOpen}
        onOpenChange={setCreditsModalOpen}
      />
    </>
  );
}
