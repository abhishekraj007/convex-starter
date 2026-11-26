"use client";

import Link from "next/link";
import { BookOpen, CreditCard, Palette, Settings, Sparkles, Upload } from "lucide-react";

import { IconTile } from "@/components/ui/icon-tile";

const actions = [
  { href: "/assistant", icon: Sparkles, label: "AI assistant", hint: "Chat" },
  { href: "/uploads", icon: Upload, label: "Uploads", hint: "Images" },
  { href: "/pricing", icon: CreditCard, label: "Billing", hint: "Plans" },
  { href: "/settings", icon: Settings, label: "Settings", hint: "Account" },
] as const;

export function QuickActions() {
  return (
    <section className="surface rounded-3xl p-5 sm:p-6">
      <header>
        <h2 className="text-[17px] font-bold tracking-[-0.025em]">Quick actions</h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground">Jump back into the tools you use.</p>
      </header>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {actions.map(({ href, icon: Icon, label, hint }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-2.5 rounded-2xl border border-border/70 p-3 transition-colors hover:border-border-strong hover:bg-accent/60"
          >
            <IconTile tone="muted" size="sm">
              <Icon />
            </IconTile>
            <span>
              <span className="block text-[12px] font-semibold">{label}</span>
              <span className="block text-[10.5px] text-muted-foreground">{hint}</span>
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/70 pt-3 text-[11px]">
        <Link href="/docs" className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <BookOpen className="size-3.5" /> Docs
        </Link>
        <Link href="/components" className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground transition-colors hover:text-foreground">
          <Palette className="size-3.5" /> Design system
        </Link>
      </div>
    </section>
  );
}
