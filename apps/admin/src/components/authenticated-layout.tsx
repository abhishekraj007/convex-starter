"use client";

import { useQuery } from "convex/react";
import { api } from "@convex-starter/backend/convex/_generated/api";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

export function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = useQuery(api.user.fetchUserAndProfile);
  const pathname = usePathname();
  const sectionTitle =
    pathname === "/dashboard"
      ? "Dashboard"
      : pathname === "/uploads"
        ? "Uploads"
        : pathname === "/app-config"
          ? "App Config"
          : pathname === "/notifications"
            ? "Notifications"
            : pathname === "/settings"
              ? "Settings"
              : pathname?.startsWith("/preview")
                ? "Users"
                : "Admin";

  // Show loading skeleton while checking auth - keeps layout stable
  const isLoading = userData === undefined && !pathname?.startsWith("/preview");

  return (
    <>
      <SidebarProvider>
        <AppSidebar isLoading={isLoading} />
        <SidebarInset>
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 bg-background/80 px-4 backdrop-blur-xl md:px-8">
            <SidebarTrigger className="-ml-1 rounded-full text-muted-foreground md:hidden" />
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
              <span className="hidden text-muted-foreground sm:inline">Acme</span>
              <span className="hidden text-faint-foreground sm:inline">/</span>
              <span className="hidden items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-[11.5px] font-medium text-muted-foreground shadow-[0_1px_2px_color-mix(in_oklab,var(--shadow-color)_6%,transparent)] sm:inline-flex">
                <span className="size-1.5 rounded-full bg-success" /> production
              </span>
              <span className="hidden text-faint-foreground sm:inline">/</span>
              <span className="truncate font-semibold text-foreground">{sectionTitle}</span>
            </nav>
            <div className="ml-auto flex items-center gap-2">
              <a
                href="/components"
                className="hidden h-8 items-center rounded-md px-2.5 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:inline-flex"
              >
                Docs
              </a>
              <a
                href="/notifications"
                aria-label="Notifications"
                className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Bell className="size-4" />
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-primary ring-2 ring-background" />
              </a>
              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
