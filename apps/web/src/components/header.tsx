"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { useTranslations } from "next-intl";
import { Coins, Menu } from "lucide-react";
import { api } from "@convex-starter/backend/convex/_generated/api";
import { ModeToggle } from "./mode-toggle";
import { LocaleSwitcher } from "./locale-switcher";
import UserMenu from "./user-menu";
import { Button } from "./ui/button";
import { CreditsModal } from "./credits-modal";
import { BrandLockup } from "./brand-mark";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { cn } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const userData = useQuery(api.user.fetchUserAndProfile);
  const userCredits = useQuery(api.features.credits.queries.getUserCredits);
  const premiumStatus = useQuery(api.features.premium.queries.isPremium);
  const [creditsModalOpen, setCreditsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { to: "/dashboard" as const, label: t("dashboard") },
    { to: "/todos" as const, label: t("todos") },
    { to: "/tutor" as const, label: t("tutor") },
    { to: "/components" as const, label: "Design system" },
    { to: "/pricing" as const, label: t("pricing") },
    { to: "/docs" as const, label: t("docs") },
  ];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-[background-color,border-color,backdrop-filter] duration-200",
        scrolled
          ? "border-border bg-background/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto grid h-14 max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5">
        <div className="flex items-center gap-2">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} side="left">
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="md:hidden" aria-label="Open menu">
                  <Menu />
                </Button>
              }
            />
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-3">
                {links.map(({ to, label }) => (
                  <Link
                    key={to}
                    href={to}
                    className="rounded-md px-3 py-2 text-[15px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" aria-label="Convex Starter home" className="rounded-md">
            <BrandLockup />
          </Link>
        </div>

        <nav aria-label="Main" className="hidden items-center gap-0.5 md:flex">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              href={to}
              aria-current={pathname === to ? "page" : undefined}
              className="rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1.5">
          <div className="hidden lg:block">
            <LocaleSwitcher compact />
          </div>
          <ModeToggle />
          {userData ? (
            <>
              {!premiumStatus?.isPremium && (
                <Button variant="brand" size="sm" shape="pill" onClick={() => router.push("/pricing")} className="hidden sm:inline-flex">
                  {tc("upgrade")}
                </Button>
              )}
              <Button variant="secondary" size="sm" shape="pill" onClick={() => setCreditsModalOpen(true)}>
                <Coins />
                <span className="tabular-nums">
                  {userCredits?.credits !== undefined ? userCredits.credits.toLocaleString() : "…"}
                </span>
              </Button>
              <UserMenu isPremium={premiumStatus?.isPremium ?? false} />
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" shape="pill" onClick={() => router.push("/auth")} className="hidden sm:inline-flex">
                Sign in
              </Button>
              <Button size="sm" shape="pill" onClick={() => router.push("/auth")}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
      <CreditsModal open={creditsModalOpen} onOpenChange={setCreditsModalOpen} />
    </header>
  );
}
