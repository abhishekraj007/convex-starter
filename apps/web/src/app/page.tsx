import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  Globe,
  KeyRound,
  Languages,
  Moon,
  Smartphone,
  Sparkles,
  UploadCloud,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Kbd } from "@/components/ui/kbd";
import { BrandLockup } from "@/components/brand-mark";
import { ProductPreview } from "@/components/marketing/product-preview";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { staticPricingTiers } from "@/components/marketing/pricing-data";
import { CopyCommand } from "@/components/marketing/copy-command";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Convex SaaS Starter - Ship Your SaaS Faster",
  description:
    "The complete SaaS starter kit with Next.js, Expo React Native, Convex, Better Auth, Polar or Dodo payments, and RevenueCat. Launch your cross-platform SaaS in days.",
};

const stack = ["Next.js 16", "Convex", "Expo SDK 56", "Better Auth", "Polar / Dodo", "RevenueCat", "Cloudflare R2", "ui-sdk"];

const faqs = [
  {
    q: "What do I get out of the box?",
    a: "A Next.js web app, an admin console and an Expo mobile app sharing one Convex backend, with email + OTP auth, Polar or Dodo and RevenueCat billing, a credit system, R2 uploads, i18n and a documented design system.",
  },
  {
    q: "Can I use only the web app?",
    a: "Yes. Every app is a separate workspace package. Delete apps/native and nothing else changes.",
  },
  {
    q: "How is the UI built?",
    a: "On Vercel's ui-sdk primitives with Tailwind v4 tokens. Each app owns its components and theme, so the marketing site and the admin console can look different.",
  },
  {
    q: "Is it production ready?",
    a: "Auth, billing webhooks, ownership checks on storage and admin-only routes are in place. Bring your keys, run convex dev, and ship.",
  },
];

function SectionHeading({ eyebrow, title, lead, className }: { eyebrow: string; title: React.ReactNode; lead?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid max-w-2xl gap-3", className)}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="text-display-sm font-semibold md:text-[44px] md:leading-[1.05]">{title}</h2>
      {lead ? <p className="text-[17px] leading-relaxed text-muted-foreground">{lead}</p> : null}
    </div>
  );
}

function BentoCell({ className, icon: Icon, title, body, children }: { className?: string; icon: React.ElementType; title: string; body: string; children?: React.ReactNode }) {
  return (
    <div className={cn("group surface relative flex flex-col overflow-hidden rounded-2xl transition-[box-shadow,border-color] duration-300 hover:border-border-strong hover:shadow-[inset_0_1px_0_var(--highlight),var(--elev-3)]", className)}>
      <div className="relative min-h-44 flex-1 overflow-hidden border-b border-border bg-subtle">{children}</div>
      <div className="grid gap-1 p-5">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-brand" aria-hidden="true" />
          <h3 className="text-[15px] font-semibold tracking-[-0.015em]">{title}</h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Convex SaaS Starter",
    description: "The complete cross-platform SaaS starter kit with authentication, payments, subscriptions, AI, and more.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web, iOS, Android",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const tiers = staticPricingTiers();

  return (
    <div className="relative flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ───────── Hero ───────── */}
      <section className="relative isolate -mt-14 overflow-hidden pt-14">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(80%_60%_at_50%_0%,black,transparent_75%)]" />
          <div className="absolute -top-40 left-1/2 h-[560px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_16%,transparent),transparent)] blur-2xl" />
          <div className="noise absolute inset-0" />
        </div>

        <div className="mx-auto max-w-6xl px-5 pt-20 md:pt-28">
          <div className="flex flex-col items-start gap-7">
            <Link
              href="/auth"
              className="group surface inline-flex h-8 items-center gap-2 rounded-full py-1 pr-3 pl-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="inline-flex h-6 items-center gap-1 rounded-full bg-brand/12 px-2 text-xs font-medium text-brand-text">
                <Sparkles className="size-3" /> New
              </span>
              Email OTP sign-in and Cloudflare R2 uploads
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <h1 className="max-w-4xl text-[44px] leading-[1.02] font-semibold tracking-[-0.045em] sm:text-display md:text-display-lg">
              Ship the SaaS,
              <br />
              <span className="text-muted-foreground">skip the boilerplate.</span>
            </h1>

            <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
              One Convex backend powering a Next.js site, an admin console and an Expo app. Auth, billing, credits,
              storage and i18n are already wired, so you start on the part only you can build.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" shape="pill" render={<Link href="/auth" />} className="pr-3">
                Start building
                <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-primary-foreground/15">
                  <ArrowRight className="size-3" />
                </span>
              </Button>
              <Button size="lg" shape="pill" variant="secondary" render={<Link href="/components" />}>
                Explore the design system
              </Button>
              <CopyCommand command="git clone github.com/abhishekraj007/convex-starter" className="hidden lg:inline-flex" />
            </div>
          </div>

          <div className="relative mt-16 md:mt-20">
            <div aria-hidden="true" className="absolute inset-x-10 -top-6 h-24 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--brand)_22%,transparent),transparent)] blur-2xl" />
            <ProductPreview className="relative [mask-image:linear-gradient(to_bottom,black_70%,transparent)]" />
          </div>
        </div>
      </section>

      {/* ───────── Stack strip ───────── */}
      <section className="mx-auto w-full max-w-6xl px-5">
        <p className="eyebrow mb-5">Built on the stack you would pick anyway</p>
        <div className="grid grid-cols-2 border-y border-border sm:grid-cols-4 lg:grid-cols-8">
          {stack.map((name, i) => (
            <div
              key={name}
              className={cn(
                "flex h-16 items-center justify-center text-[14px] font-semibold tracking-[-0.02em] text-faint-foreground transition-colors hover:text-foreground",
                i > 0 && "border-l border-border",
                "max-lg:[&:nth-child(5)]:border-l-0 max-sm:[&:nth-child(odd)]:border-l-0"
              )}
            >
              {name}
            </div>
          ))}
        </div>
      </section>

      {/* ───────── Statement ───────── */}
      <section className="mx-auto w-full max-w-6xl px-5 py-28">
        <p className="max-w-4xl text-[28px] leading-[1.2] font-semibold tracking-[-0.035em] md:text-[40px]">
          A starter that behaves like a product.{" "}
          <span className="text-faint-foreground">
            Real auth flows, real billing webhooks, real ownership checks and a design system you will not have to
            throw away on day two.
          </span>
        </p>
      </section>

      {/* ───────── Bento ───────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-28">
        <SectionHeading
          eyebrow="Features"
          title="Everything wired, nothing hidden."
          lead="Each feature ships as readable code in the monorepo, not a black-box SDK."
          className="mb-12"
        />
        <div className="grid gap-4 md:grid-cols-6">
          <BentoCell className="md:col-span-4" icon={KeyRound} title="Email, OTP and OAuth" body="Better Auth with email + password, six-digit email OTP via Cloudflare, password reset and Google / Apple sign-in.">
            <div className="absolute inset-0 flex items-center justify-center gap-6 p-6">
              <div className="surface-float w-64 rounded-xl p-4">
                <p className="text-[13px] font-semibold">Check your inbox</p>
                <p className="mt-0.5 text-[11.5px] text-muted-foreground">We sent a code to aarav@lumen.dev</p>
                <div className="mt-3 flex gap-1.5">
                  {["4", "8", "1", "9", "", ""].map((d, i) => (
                    <span key={i} className={cn("flex h-9 flex-1 items-center justify-center rounded-md border bg-card font-mono text-sm font-semibold", i === 4 ? "border-ring shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring)_20%,transparent)]" : "border-input")}>
                      {d}
                    </span>
                  ))}
                </div>
                <div className="mt-3 h-7 rounded-md bg-primary text-center text-[12px] leading-7 font-medium text-primary-foreground">Verify</div>
              </div>
              <div className="hidden w-44 flex-col gap-2 sm:flex">
                {["Continue with Google", "Continue with Apple"].map((l) => (
                  <span key={l} className="surface flex h-8 items-center justify-center rounded-lg text-[11.5px] font-medium">{l}</span>
                ))}
                <span className="eyebrow mt-1 text-center !text-[10px]">or email</span>
              </div>
            </div>
          </BentoCell>

          <BentoCell className="md:col-span-2" icon={Zap} title="Realtime by default" body="Convex queries push updates to every client, web and mobile, with no cache to invalidate.">
            <div className="absolute inset-0 flex flex-col justify-center gap-2 px-6">
              {[
                { t: "Design review", s: "now", live: true },
                { t: "Ship pricing page", s: "2m" },
                { t: "Fix OTP resend", s: "8m" },
              ].map((r) => (
                <div key={r.t} className="surface flex h-9 items-center gap-2 rounded-lg px-3 text-[12px]">
                  <span className={cn("size-1.5 rounded-full", r.live ? "bg-success shadow-[0_0_0_3px_color-mix(in_oklab,var(--success)_25%,transparent)]" : "bg-faint-foreground/50")} />
                  {r.t}
                  <span className="ml-auto font-mono text-[10.5px] text-faint-foreground">{r.s}</span>
                </div>
              ))}
            </div>
          </BentoCell>

          <BentoCell className="md:col-span-2" icon={CreditCard} title="Billing that reconciles" body="Polar or Dodo on the web — switched with one env var — RevenueCat on mobile, one credit ledger in Convex.">
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="surface-float w-full max-w-56 rounded-xl p-4 text-[12px]">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Pro Yearly</span>
                  <Badge variant="success" dot className="h-5 text-[10.5px]">Paid</Badge>
                </div>
                <div className="mt-3 grid gap-1.5 text-muted-foreground">
                  <div className="flex justify-between"><span>Subtotal</span><span className="font-mono">$99.00</span></div>
                  <div className="flex justify-between"><span>Credits</span><span className="font-mono">+1,200</span></div>
                </div>
                <div className="mt-3 flex justify-between border-t border-border pt-2 font-medium"><span>Total</span><span className="font-mono">$99.00</span></div>
              </div>
            </div>
          </BentoCell>

          <BentoCell className="md:col-span-2" icon={UploadCloud} title="R2 storage" body="Signed uploads to Cloudflare R2 with per-user ownership checks.">
            <div className="absolute inset-0 flex flex-col justify-center gap-2.5 px-6">
              {[
                { n: "hero-shot.png", p: 100 },
                { n: "onboarding.mp4", p: 64 },
                { n: "invoice-0042.pdf", p: 28 },
              ].map((f) => (
                <div key={f.n} className="grid gap-1.5">
                  <div className="flex justify-between text-[11.5px]">
                    <span className="font-medium">{f.n}</span>
                    <span className="font-mono text-faint-foreground">{f.p}%</span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full", f.p === 100 ? "bg-success" : "bg-brand")} style={{ width: `${f.p}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </BentoCell>

          <BentoCell className="md:col-span-2" icon={Smartphone} title="Native mobile" body="Expo Router + NativeWind app on the same backend and auth.">
            <div className="absolute inset-0 flex items-end justify-center">
              <div className="h-40 w-28 rounded-t-[22px] border border-b-0 border-border-strong bg-card p-2 pb-0 shadow-[var(--elev-3)]">
                <div className="mx-auto mb-2 h-1.5 w-8 rounded-full bg-muted" />
                <div className="grid gap-1.5">
                  <div className="h-10 rounded-lg bg-[linear-gradient(135deg,var(--chart-1),var(--chart-3))]" />
                  <div className="h-3 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="mt-1 h-6 rounded-md bg-primary" />
                </div>
              </div>
            </div>
          </BentoCell>

          <BentoCell className="md:col-span-3" icon={Languages} title="i18n with RTL" body="next-intl on the web, shared message catalogs, right-to-left layouts handled.">
            <div className="absolute inset-0 flex flex-wrap content-center items-center justify-center gap-2 p-6">
              {["English", "Español", "Français", "Deutsch", "日本語", "العربية", "हिन्दी"].map((l, i) => (
                <span key={l} className={cn("surface inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px]", i === 0 && "border-ring/50 text-foreground")}>
                  <Globe className="size-3 text-faint-foreground" /> {l}
                </span>
              ))}
            </div>
          </BentoCell>

          <BentoCell className="md:col-span-3" icon={Moon} title="Light and dark, both first-class" body="OKLCH tokens, AA contrast and themed popups in both modes, switched without a flash.">
            <div className="absolute inset-0 grid grid-cols-2">
              {(["light", "dark"] as const).map((m) => (
                <div key={m} className={cn(m, "flex items-center justify-center bg-background p-5")}>
                  <div className="surface w-full max-w-44 rounded-xl p-3 text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="size-6 rounded-full bg-[linear-gradient(135deg,var(--chart-1),var(--chart-2))]" />
                      <div className="grid gap-1">
                        <span className="h-2 w-16 rounded bg-foreground/80" />
                        <span className="h-1.5 w-10 rounded bg-muted-foreground/40" />
                      </div>
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      <span className="h-5 flex-1 rounded-md bg-primary" />
                      <span className="h-5 flex-1 rounded-md border border-border bg-card" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BentoCell>
        </div>
      </section>

      {/* ───────── Pricing ───────── */}
      <section className="border-y border-border bg-subtle">
        <div className="mx-auto max-w-6xl px-5 py-28">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow="Pricing" title="Simple plans, wired to your payment provider." lead="These are the demo plans the starter ships with. Edit one constant to change them." />
            <Button variant="secondary" shape="pill" render={<Link href="/pricing" />}>
              Compare plans <ArrowUpRight />
            </Button>
          </div>
          <PricingCards
            tiers={tiers}
            renderAction={(tier) => (
              <Button className="w-full" variant={tier.featured ? "default" : "secondary"} render={<Link href={tier.id === "free" ? "/auth" : "/pricing"} />}>
                {tier.id === "free" ? "Start for free" : "Upgrade to Pro"}
              </Button>
            )}
          />
        </div>
      </section>

      {/* ───────── FAQ ───────── */}
      <section className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-28 md:grid-cols-[1fr_1.4fr]">
        <SectionHeading className="content-start self-start md:sticky md:top-24" eyebrow="FAQ" title="Questions, answered." lead={<>Still curious? Read the <Link href="/docs" className="text-foreground underline decoration-border-strong underline-offset-4 hover:decoration-foreground">docs</Link>.</>} />
        <Accordion defaultValue={["0"]}>
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={String(i)}>
              <AccordionTrigger>{f.q}</AccordionTrigger>
              <AccordionContent>{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pb-28">
        <div className="relative isolate overflow-hidden rounded-3xl bg-[oklch(0.17_0.006_285)] px-8 py-20 text-center text-[oklch(0.97_0_0)] shadow-[var(--elev-4)] dark:bg-card dark:ring-1 dark:ring-border">
          <div aria-hidden="true" className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(1_0_0/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(60%_70%_at_50%_100%,black,transparent)]" />
            <div className="absolute -bottom-48 left-1/2 h-96 w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.6_0.2_280/0.45),transparent)] blur-2xl" />
            <div className="noise absolute inset-0 !opacity-[0.08]" />
          </div>
          <h2 className="mx-auto max-w-2xl text-[36px] leading-[1.05] font-semibold tracking-[-0.04em] md:text-[52px]">Your next launch starts here.</h2>
          <p className="mx-auto mt-4 max-w-md text-[17px] text-[oklch(0.78_0.01_285)]">Clone it, add your keys, and have sign-in and checkout working before lunch.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" shape="pill" render={<Link href="/auth" />} className="bg-[oklch(0.97_0_0)] text-[oklch(0.17_0.006_285)] shadow-[inset_0_1px_0_white,0_0_0_1px_oklch(0.97_0_0)] hover:bg-white">
              Get started free
            </Button>
            <Button size="lg" shape="pill" variant="ghost" render={<Link href="/docs" />} className="text-[oklch(0.85_0.01_285)] hover:bg-white/10 hover:text-white">
              Read the docs <ArrowRight />
            </Button>
          </div>
          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-[oklch(0.65_0.01_285)]">
            Press <Kbd className="border-white/15 bg-white/10 text-[oklch(0.85_0.01_285)] shadow-none">⌘</Kbd>
            <Kbd className="border-white/15 bg-white/10 text-[oklch(0.85_0.01_285)] shadow-none">B</Kbd> in the app to toggle the sidebar
          </p>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div className="grid content-start gap-3">
            <BrandLockup />
            <p className="max-w-xs text-sm text-muted-foreground">The cross-platform SaaS starter on Convex. Web, admin and mobile from one backend.</p>
          </div>
          {[
            { h: "Product", l: [["Pricing", "/pricing"], ["Dashboard", "/dashboard"], ["Design system", "/components"]] },
            { h: "Build", l: [["Docs", "/docs"], ["Uploads", "/uploads"], ["Todos", "/todos"]] },
            { h: "Account", l: [["Sign in", "/auth"], ["Settings", "/settings"], ["English Tutor", "/tutor"]] },
          ].map((col) => (
            <div key={col.h} className="grid content-start gap-3">
              <p className="eyebrow">{col.h}</p>
              {col.l.map(([label, href]) => (
                <Link key={href} href={href as "/"} className="w-fit text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-6 text-xs text-faint-foreground">
          <p>&copy; {new Date().getFullYear()} Convex Starter. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-success" /> All systems normal
          </p>
        </div>
      </footer>
    </div>
  );
}
