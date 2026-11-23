"use client";

import * as React from "react";
import {
  Bell,
  Check,
  ChevronRight,
  Cloud,
  Command,
  CreditCard,
  Database,
  FileText,
  Globe,
  Inbox,
  KeyRound,
  LayoutDashboard,
  Lock,
  Mail,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
  Upload,
  User,
  Zap,
} from "lucide-react";

import { DocSection, Demo, Swatch, TokenTable, StateLabel } from "./doc-kit";
import { cn } from "@/lib/utils";

const neutral = [
  { token: "background", label: "Background", on: "foreground" },
  { token: "subtle", label: "Subtle", on: "foreground" },
  { token: "card", label: "Card", on: "card-foreground" },
  { token: "popover", label: "Popover", on: "popover-foreground" },
  { token: "muted", label: "Muted", on: "muted-foreground" },
  { token: "accent", label: "Accent (hover)", on: "accent-foreground" },
  { token: "foreground", label: "Foreground", on: "background" },
  { token: "muted-foreground", label: "Muted text", on: "background" },
  { token: "faint-foreground", label: "Faint text", on: "background" },
  { token: "border", label: "Border" },
  { token: "border-strong", label: "Border strong" },
  { token: "input", label: "Input border" },
];

const action = [
  { token: "primary", label: "Primary", on: "primary-foreground" },
  { token: "secondary", label: "Secondary", on: "secondary-foreground" },
  { token: "brand", label: "Brand", on: "brand-foreground" },
  { token: "brand-soft", label: "Brand soft", on: "brand" },
  { token: "ring", label: "Focus ring" },
];

const semantic = [
  { token: "success", label: "Success", on: "success-foreground" },
  { token: "warning", label: "Warning", on: "warning-foreground" },
  { token: "info", label: "Info", on: "info-foreground" },
  { token: "destructive", label: "Destructive", on: "destructive-foreground" },
];

const charts = [1, 2, 3, 4, 5].map((n) => ({ token: `chart-${n}`, label: `Chart ${n}` }));

const sidebar = [
  { token: "sidebar", label: "Sidebar", on: "sidebar-foreground" },
  { token: "sidebar-accent", label: "Sidebar accent", on: "sidebar-accent-foreground" },
  { token: "sidebar-border", label: "Sidebar border" },
  { token: "sidebar-primary", label: "Sidebar primary", on: "sidebar-primary-foreground" },
];

function SwatchGrid({ title, items }: { title: string; items: { token: string; label: string; on?: string }[] }) {
  return (
    <div className="grid gap-3">
      <h3 className="text-sm font-semibold tracking-[-0.01em]">{title}</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {items.map((i) => (
          <Swatch key={i.token} token={i.token} label={i.label} onToken={i.on} />
        ))}
      </div>
    </div>
  );
}

const typeScale = [
    { name: "Display", cls: "text-[2.75rem] leading-[1.04] font-semibold tracking-[-0.04em]", spec: "44 / 46 · 600 · -0.04em", sample: "Console · Cobalt" },
  { name: "Display sm", cls: "text-[2.25rem] leading-[1.1] font-semibold tracking-[-0.035em]", spec: "36 / 40 · 600 · -0.035em", sample: "Run the product" },
  { name: "Page title", cls: "text-2xl font-semibold tracking-[-0.03em]", spec: "24 / 30 · 600 · -0.03em", sample: "Users" },
  { name: "Heading 2", cls: "text-lg font-semibold tracking-[-0.02em]", spec: "18 / 28 · 600 · -0.02em", sample: "Recent invoices" },
  { name: "Title", cls: "text-[15px] font-semibold tracking-[-0.015em]", spec: "15 / 22 · 600 · -0.015em", sample: "Card title" },
  { name: "Body", cls: "text-sm leading-relaxed", spec: "14 / 22 · 400", sample: "Default body size across the console: forms, descriptions, dialogs." },
  
  { name: "UI", cls: "text-[13px]", spec: "13 / 20 · 400–500", sample: "Navigation, menu items, table cells and controls." },
  { name: "Tabular", cls: "font-mono text-[12.5px] tabular-nums", spec: "12.5 Geist Mono · tnum", sample: "12,847 · 1,240.00 · 09:41:12" },
  { name: "Caption", cls: "text-xs text-muted-foreground", spec: "12 / 16 · 400", sample: "Helper text and metadata" },
  { name: "Eyebrow", cls: "eyebrow", spec: "11 mono · 500 · +0.08em · upper", sample: "Section label" },
  { name: "Mono", cls: "font-mono text-[13px]", spec: "13 Geist Mono · tabular", sample: "pnpm dev --filter admin" },
];

const spacing = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
const radii = [
  { name: "xs", v: "var(--radius-xs)" },
  { name: "sm", v: "var(--radius-sm)" },
  { name: "md", v: "var(--radius-md)" },
  { name: "lg", v: "var(--radius-lg)" },
  { name: "xl", v: "var(--radius-xl)" },
  { name: "2xl", v: "var(--radius-2xl)" },
  { name: "full", v: "9999px" },
];
const elevations = [
  { name: "Flat", cls: "surface-flat", note: "hairline only" },
  { name: "Elev 1", cls: "border border-border bg-card shadow-[inset_0_1px_0_var(--highlight),var(--elev-1)]", note: "--elev-1 · controls" },
  { name: "Elev 2", cls: "surface", note: "--elev-2 · cards" },
  { name: "Elev 3", cls: "border border-border bg-card shadow-[inset_0_1px_0_var(--highlight),var(--elev-3)]", note: "--elev-3 · raised" },
  { name: "Elev 4", cls: "surface-float", note: "--elev-4 · popovers, dialogs" },
];
const easings = [
  { name: "ease-out-soft", v: "cubic-bezier(0.2, 0.8, 0.2, 1)", use: "Enter, hover, color", ms: 180 },
  { name: "ease-spring", v: "cubic-bezier(0.34, 1.4, 0.64, 1)", use: "Toggles, thumbs, pops", ms: 320 },
  { name: "linear", v: "linear", use: "Spinners, shimmer", ms: 1000 },
];
const icons = [Search, Command, Bell, Inbox, Mail, User, Settings, LayoutDashboard, CreditCard, Upload, Cloud, Database, Globe, Lock, KeyRound, FileText, Sparkles, Zap, Sun, Moon, Check, ChevronRight];

function MotionDemo({ ease, ms }: { ease: string; ms: number }) {
  const [on, setOn] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="relative h-9 w-full rounded-lg border border-border bg-subtle text-left"
      aria-label="Play easing demo"
    >
      <span
        className="absolute top-1 left-1 size-7 rounded-md bg-primary shadow-[var(--elev-2)]"
        style={{ transform: on ? "translateX(calc(100cqw - 2.25rem))" : "translateX(0)", transition: `transform ${ms}ms ${ease}` }}
      />
    </button>
  );
}

export function Foundations() {
  return (
    <>
      <DocSection
        id="colors"
        eyebrow="Foundations"
        title="Color"
        description="Cool zinc neutrals with one cobalt accent. In the console, cobalt is the primary action color as well as focus and selection; semantic colors are kept for status only. Values are read live from the current theme. Hover a swatch to copy its variable."
      >
        <SwatchGrid title="Neutrals and surfaces" items={neutral} />
        <SwatchGrid title="Actions" items={action} />
        <SwatchGrid title="Semantic" items={semantic} />
        <SwatchGrid title="Charts" items={charts} />
        <SwatchGrid title="Sidebar" items={sidebar} />
        <div className="surface grid gap-4 rounded-xl p-5 md:grid-cols-3">
          {[
            ["Foreground on background", "≈ 18:1", "AAA"],
            ["Muted on background", "≥ 6:1", "AA"],
            ["Brand text on background", "≥ 5:1", "AA"],
          ].map(([k, v, grade]) => (
            <div key={k} className="grid gap-1">
              <StateLabel>{k}</StateLabel>
              <p className="text-xl font-semibold tracking-[-0.03em] tabular-nums">
                {v} <span className="ml-1 rounded-md bg-success/12 px-1.5 py-0.5 align-middle font-mono text-[11px] text-success-text">{grade}</span>
              </p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        id="typography"
        eyebrow="Foundations"
        title="Typography"
        description="Inter (cv11, ss01) for UI at a dense 13–14px base, Geist Mono for IDs, code and numbers in tables. Headings stay modest and tight; hierarchy comes from weight and three text tones."
      >
        <div className="surface overflow-hidden rounded-xl">
          {typeScale.map((t, i) => (
            <div key={t.name} className={cn("grid items-baseline gap-2 px-5 py-4 md:grid-cols-[150px_1fr]", i > 0 && "border-t border-border")}>
              <div className="grid gap-0.5">
                <p className="text-[13px] font-medium">{t.name}</p>
                <p className="font-mono text-[10.5px] text-faint-foreground">{t.spec}</p>
              </div>
              <p className={cn("min-w-0 truncate", t.cls)}>{t.sample}</p>
            </div>
          ))}
        </div>
        <Demo title="Text tones" stageClassName="flex-col items-start gap-1">
          <p className="text-sm text-foreground">Foreground: primary content and headings.</p>
          <p className="text-sm text-muted-foreground">Muted: supporting copy, descriptions, secondary labels.</p>
          <p className="text-sm text-faint-foreground">Faint: placeholders, timestamps, decorative metadata.</p>
          <p className="text-sm text-brand-text">Brand: links and the occasional highlight.</p>
        </Demo>
      </DocSection>

      <DocSection id="spacing" eyebrow="Foundations" title="Spacing" description="A 4px base. Dense: controls 32–36px tall, table rows 44px, cards 16–20px padding, page gutters 32px.">
        <TokenTable
          rows={spacing.map((s) => ({
            token: `space-${s}`,
            preview: <div className="h-3 rounded-sm bg-brand/70" style={{ width: `${s * 4}px` }} />,
            note: `${s * 4}px`,
          }))}
        />
      </DocSection>

      <DocSection id="radius" eyebrow="Foundations" title="Radius" description="Derived from one --radius (8px), tighter than the marketing site. Controls md, cards xl, dialogs 2xl.">
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {radii.map((r) => (
            <div key={r.name} className="grid gap-2">
              <div className="surface aspect-square" style={{ borderRadius: r.v }} />
              <p className="font-mono text-[11px] text-muted-foreground">rounded-{r.name}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection
        id="elevation"
        eyebrow="Foundations"
        title="Elevation"
        description="Depth comes from a hairline, a 1px inner top highlight and layered, low-opacity shadows. In dark mode shadows deepen and the highlight does the lifting."
      >
        <div className="grid gap-4 rounded-xl bg-subtle p-6 sm:grid-cols-3 lg:grid-cols-5">
          {elevations.map((e) => (
            <div key={e.name} className="grid gap-2">
              <div className={cn("flex h-24 items-end rounded-xl p-3", e.cls)}>
                <span className="text-[13px] font-medium">{e.name}</span>
              </div>
              <p className="font-mono text-[10.5px] text-faint-foreground">{e.note}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="motion" eyebrow="Foundations" title="Motion" description="Quick and quiet: 120–200ms for UI feedback, a soft spring for toggles. Click a track to play.">
        <div className="surface overflow-hidden rounded-xl">
          {easings.map((e, i) => (
            <div key={e.name} className={cn("grid items-center gap-4 px-5 py-4 md:grid-cols-[200px_1fr_220px]", i > 0 && "border-t border-border")}>
              <div>
                <p className="font-mono text-[12.5px]">--{e.name}</p>
                <p className="text-xs text-muted-foreground">{e.use}</p>
              </div>
              <div className="[container-type:inline-size]">
                <MotionDemo ease={e.v} ms={e.ms} />
              </div>
              <p className="font-mono text-[10.5px] text-faint-foreground">{e.v} · {e.ms}ms</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="icons" eyebrow="Foundations" title="Iconography" description="Lucide at 16px in UI (14px in dense rows), 1.75–2px stroke, tinted muted until active.">
        <div className="surface grid grid-cols-4 overflow-hidden rounded-xl sm:grid-cols-6 lg:grid-cols-11">
          {icons.map((Icon, i) => (
            <div key={i} className="flex aspect-square items-center justify-center border-r border-b border-border text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Icon className="size-4" />
            </div>
          ))}
        </div>
      </DocSection>
    </>
  );
}
