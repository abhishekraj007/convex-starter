"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  CreditCard,
  PanelLeftIcon,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Palette,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";
import { AppSearch } from "@/components/app-search";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Workspace",
    items: [
      { title: "Home", url: "/", icon: Home },
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "AI Assistant", url: "/assistant", icon: Sparkles },
      { title: "Uploads", url: "/uploads", icon: Upload },
    ],
  },
  {
    label: "Resources",
    items: [
      { title: "Pricing", url: "/pricing", icon: CreditCard },
      { title: "Docs", url: "/docs", icon: FileText },
      { title: "Design system", url: "/components", icon: Palette },
    ],
  },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const userData = useQuery(api.user.fetchUserAndProfile);
  const premiumStatus = useQuery(api.features.premium.queries.isPremium);
  const { state, toggleSidebar, isMobile } = useSidebar();
  const collapsed = !isMobile && state === "collapsed";

  const userName = userData?.profile?.name || userData?.userMetadata?.name || "Guest";
  const userEmail = userData?.userMetadata?.email || "Not signed in";
  const userImage = userData?.userMetadata?.image;
  const isPremium = premiumStatus?.isPremium ?? false;

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
            <div className="flex h-9 min-w-0 items-center gap-2 px-0.5">
              <BrandMark />
              <span className="min-w-0 truncate whitespace-nowrap text-[13px] tracking-[-0.03em]"><span className="font-extrabold">Convex</span> <span className="ml-[0.14em] font-medium text-muted-foreground">Starter</span></span>
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
                  const active = pathname === item.url || (item.url === "/dashboard" && pathname?.startsWith("/preview"));
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton isActive={active} tooltip={item.title} render={<Link href={item.url as "/"} />}>
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
        {!isPremium ? (
          collapsed ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    shape="pill"
                    className="size-8"
                    aria-label="Upgrade Pro"
                    onClick={() => router.push("/pricing")}
                  />
                }
              >
                <Sparkles />
              </TooltipTrigger>
              <TooltipContent side="right" className="ml-2" hideArrow>Upgrade Pro</TooltipContent>
            </Tooltip>
          ) : (
            <div className="promo-card relative overflow-hidden rounded-2xl p-4">
              <div aria-hidden="true" className="absolute -top-12 -right-10 size-28 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_55%,transparent),transparent)]" />
              <span className="relative flex size-9 items-center justify-center rounded-xl bg-white/12 text-white">
                <Sparkles className="size-4" />
              </span>
              <p className="relative mt-3 text-[15px] leading-tight font-bold tracking-[-0.02em]">Upgrade Pro</p>
              <p className="relative mt-1 text-[11.5px] leading-relaxed text-promo-muted">Discover the benefits of an upgraded account.</p>
              <div className="relative mt-3 flex items-center justify-between text-[10.5px] text-promo-muted">
                <span>31 / 50 credits used</span>
                <span className="tabular-nums">62%</span>
              </div>
              <div className="relative mt-1.5 h-1 overflow-hidden rounded-full bg-white/15">
                <div className="h-full w-[62%] rounded-full bg-white/80" />
              </div>
              <Button size="sm" shape="pill" className="relative mt-3.5 w-full" onClick={() => router.push("/pricing")}>
                Upgrade now
              </Button>
            </div>
          )
        ) : null}
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
                  <span className="truncate text-[11px] text-faint-foreground">{userEmail}</span>
                </span>
                <ChevronsUpDown className="size-3.5 text-faint-foreground" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56" side="top" align="start" sideOffset={6}>
            <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push("/settings" as "/")}>
              <Settings />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                authClient.signOut({
                  fetchOptions: { onSuccess: () => router.push("/auth") },
                });
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
