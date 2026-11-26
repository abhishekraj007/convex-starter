"use client";

import * as React from "react";
import {
  Bell,
  Mail,
  ChevronsUpDown,
  PanelLeftIcon,
  LayoutDashboard,
  LogOut,
  Palette,
  Settings,
  SlidersHorizontal,
  Upload,
  Users,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@convex-starter/backend/convex/_generated/api";
import { authClient } from "@/lib/auth-client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "./ui/skeleton";
import { BrandMark } from "@/components/brand-mark";
import { AppSearch } from "@/components/app-search";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Users", url: "/preview", icon: Users },
    ],
  },
  {
    label: "Content",
    items: [
      { title: "Uploads", url: "/uploads", icon: Upload },
      { title: "Notifications", url: "/notifications", icon: Bell },
      { title: "Emails", url: "/emails", icon: Mail },
    ],
  },
  {
    label: "Configuration",
    items: [
      { title: "App Config", url: "/app-config", icon: SlidersHorizontal },
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Design system", url: "/components", icon: Palette },
    ],
  },
];

export function AppSidebar({ isLoading = false }: { isLoading?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const userData = useQuery(api.user.fetchUserAndProfile);
  const { state, toggleSidebar, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";

  const userName = userData?.profile?.name || userData?.userMetadata?.name || "Admin";
  const userEmail = userData?.userMetadata?.email || "admin@convex-starter.dev";
  const userImage = userData?.userMetadata?.image;

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader
        className={cn(
          collapsed ? "items-center gap-2 px-1 pt-4 pb-2" : "gap-3 px-4 pr-10 pt-5 pb-2 md:pr-4"
        )}
      >
        {collapsed ? (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Expand sidebar"
              title="Expand sidebar"
              onClick={toggleSidebar}
              className="size-9 shrink-0 rounded-xl"
            >
              <PanelLeftIcon />
            </Button>
            <AppSearch compact />
          </>
        ) : (
          <>
            <div className="flex h-9 w-full items-center gap-2.5 px-1">
              <BrandMark />
              <span className="grid min-w-0 flex-1 leading-tight">
                <span className="truncate text-[14px] tracking-[-0.03em]"><span className="font-extrabold">Convex</span> <span className="ml-[0.14em] font-medium text-muted-foreground">Starter</span></span>
                <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-success" /> Production
                </span>
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                onClick={toggleSidebar}
                className="ml-auto size-7 shrink-0 text-muted-foreground"
              >
                <PanelLeftIcon />
              </Button>
            </div>
            <AppSearch />
          </>
        )}
      </SidebarHeader>
      <SidebarContent className={collapsed ? "px-0" : "px-2"}>
        {groups.map((group) => (
          <SidebarGroup key={group.label} className={cn("py-3", collapsed ? "px-2" : "px-1")}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={active} tooltip={item.title} render={<a href={item.url} />}>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className={cn("gap-3", collapsed ? "items-center px-2 pb-3" : "px-3 pb-4")}>
        {isLoading ? (
          collapsed ? (
            <Skeleton className="size-8 rounded-full" />
          ) : (
            <div className="flex h-12 items-center gap-2.5 px-1.5">
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-2.5 w-32" />
              </div>
            </div>
          )
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label={collapsed ? "Account menu" : undefined}
                  title={collapsed ? "Account menu" : undefined}
                  className={cn(
                    "flex items-center border-0 bg-transparent text-left shadow-none transition-colors hover:bg-sidebar-accent data-[open]:bg-sidebar-accent",
                    collapsed ? "size-8 justify-center rounded-full p-0" : "h-auto w-full gap-2.5 rounded-xl p-2"
                  )}
                />
              }
            >
              <Avatar className={collapsed ? "size-8" : "size-9"}>
                <AvatarImage src={userImage || undefined} alt={userName} />
                <AvatarFallback className="bg-brand text-brand-foreground">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {collapsed ? null : (
                <>
                  <span className="grid min-w-0 flex-1 leading-tight">
                    <span className="truncate text-[13px] font-semibold">{userName}</span>
                    <span className="truncate text-[11.5px] text-faint-foreground">{userEmail}</span>
                  </span>
                  <ChevronsUpDown className="size-3.5 text-faint-foreground" />
                </>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56" side="top" align="start" sideOffset={6}>
              <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => router.push("/settings" as never)}>
                <Settings />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  authClient.signOut({
                    fetchOptions: {
                      onSuccess: () => {
                        router.replace("/");
                      },
                    },
                  });
                }}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
