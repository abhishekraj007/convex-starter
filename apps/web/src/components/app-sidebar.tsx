"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Palette,
  Search,
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
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/brand-mark";

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

  const userName = userData?.profile?.name || userData?.userMetadata?.name || "Guest";
  const userEmail = userData?.userMetadata?.email || "Not signed in";
  const userImage = userData?.userMetadata?.image;
  const isPremium = premiumStatus?.isPremium ?? false;

  return (
    <Sidebar variant="inset">
      <SidebarHeader className="gap-3 px-3 pt-3 pb-1">
        <div className="flex h-8 items-center gap-2 px-1">
          <BrandMark />
          <span className="text-[13.5px] font-semibold tracking-[-0.015em]">Convex Starter</span>
          <span className="ml-auto rounded-md border border-sidebar-border px-1.5 py-px font-mono text-[10px] text-faint-foreground">
            {isPremium ? "PRO" : "FREE"}
          </span>
        </div>
        <button
          type="button"
          className="flex h-8 w-full items-center gap-2 rounded-md border border-sidebar-border bg-card px-2 text-[13px] text-faint-foreground shadow-[inset_0_1px_0_var(--highlight)] transition-colors hover:border-border-strong hover:text-muted-foreground dark:bg-white/[0.03]"
        >
          <Search className="size-3.5" />
          Search…
          <Kbd className="ml-auto h-[18px] text-[10px]">⌘K</Kbd>
        </button>
      </SidebarHeader>
      <SidebarContent className="px-1">
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.url || (item.url === "/dashboard" && pathname?.startsWith("/preview"));
                  return (
                    <SidebarMenuItem key={item.title}>
                      {active ? <span aria-hidden="true" className="absolute top-2 bottom-2 -left-2 z-10 w-[3px] rounded-r-full bg-brand" /> : null}
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
      <SidebarFooter className="gap-3 p-3">
        {!isPremium ? (
          <div className="surface relative overflow-hidden rounded-xl p-3">
            <div aria-hidden="true" className="absolute -top-10 -right-8 size-24 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_30%,transparent),transparent)]" />
            <p className="flex items-center gap-1.5 text-[13px] font-medium">
              <Sparkles className="size-3.5 text-brand" /> Upgrade to Pro
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Unlimited credits and priority support.</p>
            <div className="mt-2.5 h-1 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-[62%] rounded-full bg-brand" />
            </div>
            <p className="mt-1.5 font-mono text-[10.5px] text-faint-foreground">31 / 50 credits used</p>
            <Button size="xs" variant="default" className="mt-3 w-full" onClick={() => router.push("/pricing")}>
              See plans
            </Button>
          </div>
        ) : null}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-sidebar-accent data-[open]:bg-sidebar-accent"
              />
            }
          >
            <Avatar className="size-8">
              <AvatarImage src={userImage || undefined} alt={userName} />
              <AvatarFallback className="bg-[linear-gradient(135deg,var(--chart-1),var(--chart-3))] text-white">
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="grid min-w-0 flex-1 leading-tight">
              <span className="truncate text-[13px] font-medium">{userName}</span>
              <span className="truncate text-xs text-faint-foreground">{userEmail}</span>
            </span>
            <ChevronsUpDown className="size-3.5 text-faint-foreground" />
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
