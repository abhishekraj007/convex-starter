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
          <header className="sticky top-0 z-40 flex h-12 shrink-0 items-center gap-2 border-b border-border bg-background/80 px-3 backdrop-blur-xl md:px-4">
            <SidebarTrigger className="-ml-1 text-muted-foreground" />
            <Separator orientation="vertical" className="mr-1 h-4" />
            <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13px]">
              <span className="hidden text-muted-foreground sm:inline">Acme</span>
              <span className="hidden text-faint-foreground sm:inline">/</span>
              <span className="hidden items-center gap-1.5 rounded-full border border-border px-2 py-0.5 text-[11.5px] text-muted-foreground sm:inline-flex">
                <span className="size-1.5 rounded-full bg-success" /> production
              </span>
              <span className="hidden text-faint-foreground sm:inline">/</span>
              <span className="truncate font-medium text-foreground">{sectionTitle}</span>
            </nav>
            <div className="ml-auto flex items-center gap-1.5">
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
