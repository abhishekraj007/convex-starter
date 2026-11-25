"use client";

import * as React from "react";
import {
  Bell,
  Mail,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Palette,
  Search,
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
import { Kbd } from "@/components/ui/kbd";
import { Skeleton } from "./ui/skeleton";
import { BrandMark } from "@/components/brand-mark";

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

  const userName = userData?.profile?.name || userData?.userMetadata?.name || "Admin";
  const userEmail = userData?.userMetadata?.email || "admin@convex-starter.dev";
  const userImage = userData?.userMetadata?.image;

  return (
    <Sidebar>
      <SidebarHeader className="gap-2.5 border-b border-sidebar-border px-3 py-3">
        <button
          type="button"
          className="flex h-9 w-full items-center gap-2 rounded-lg px-1.5 text-left transition-colors hover:bg-sidebar-accent"
        >
          <BrandMark />
          <span className="grid min-w-0 flex-1 leading-tight">
            <span className="truncate text-[13px] font-semibold tracking-[-0.01em]">Convex Starter</span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" /> Production
            </span>
          </span>
          <ChevronsUpDown className="size-3.5 text-faint-foreground" />
        </button>
        <button
          type="button"
          className="flex h-8 w-full items-center gap-2 rounded-md border border-sidebar-border bg-card px-2 text-[13px] text-faint-foreground shadow-[inset_0_1px_0_var(--highlight)] transition-colors hover:border-border-strong hover:text-muted-foreground dark:bg-white/[0.03]"
        >
          <Search className="size-3.5" />
          Jump to…
          <Kbd className="ml-auto h-[18px] text-[10px]">⌘K</Kbd>
        </button>
      </SidebarHeader>
      <SidebarContent className="px-1 pt-1">
        {groups.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      {active ? <span aria-hidden="true" className="absolute top-2 bottom-2 -left-2 z-10 w-[3px] rounded-r-full bg-primary" /> : null}
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
      <SidebarFooter className="border-t border-sidebar-border p-2">
        {isLoading ? (
          <div className="flex h-12 items-center gap-2.5 px-1.5">
            <Skeleton className="size-8 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-2.5 w-32" />
            </div>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className="flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-sidebar-accent data-[open]:bg-sidebar-accent"
                />
              }
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarImage src={userImage || undefined} alt={userName} />
                <AvatarFallback className="rounded-lg bg-[linear-gradient(135deg,var(--chart-1),var(--chart-2))] text-white">
                  {userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="grid min-w-0 flex-1 leading-tight">
                <span className="truncate text-[13px] font-medium">{userName}</span>
                <span className="truncate text-[11.5px] text-faint-foreground">{userEmail}</span>
              </span>
              <ChevronsUpDown className="size-3.5 text-faint-foreground" />
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
