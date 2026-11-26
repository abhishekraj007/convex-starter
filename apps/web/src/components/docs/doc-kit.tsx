"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export function DocSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} data-doc-section className={cn("scroll-mt-24 border-t border-border pt-12 pb-4 first:border-t-0 first:pt-0", className)}>
      <header className="mb-6 max-w-2xl">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h2 className="mt-2 text-[1.625rem] leading-tight font-semibold tracking-[-0.035em]">
          <a href={`#${id}`} className="group/anchor inline-flex items-center gap-2 outline-none">
            {title}
            <span aria-hidden="true" className="text-faint-foreground opacity-0 transition-opacity group-hover/anchor:opacity-100">#</span>
          </a>
        </h2>
        {description ? <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{description}</p> : null}
      </header>
      <div className="grid gap-5">{children}</div>
    </section>
  );
}

/** A live example: preview stage on top, copyable source below. */
export function Demo({
  title,
  description,
  code,
  children,
  stageClassName,
  className,
}: {
  title?: string;
  description?: string;
  code?: string;
  children: React.ReactNode;
  stageClassName?: string;
  className?: string;
}) {
  const [showCode, setShowCode] = React.useState(false);
  return (
    <div className={cn("surface overflow-hidden rounded-xl", className)}>
      {title || code ? (
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="min-w-0">
            {title ? <p className="text-[13px] font-medium">{title}</p> : null}
            {description ? <p className="truncate text-xs text-muted-foreground">{description}</p> : null}
          </div>
          {code ? (
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => setShowCode((v) => !v)}
                aria-expanded={showCode}
                className="h-7 rounded-md px-2 font-mono text-[11px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {showCode ? "Hide code" : "</> Code"}
              </button>
              <CopyButton value={code} />
            </div>
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          "relative flex min-h-28 flex-wrap items-center gap-3 bg-background/60 p-6 [background-image:radial-gradient(color-mix(in_oklab,var(--foreground)_7%,transparent)_1px,transparent_1px)] [background-size:16px_16px]",
          stageClassName
        )}
      >
        {children}
      </div>
      {code && showCode ? <CodeBlock code={code} className="rounded-none border-0 border-t" /> : null}
    </div>
  );
}

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={() => {
        void navigator.clipboard?.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1400);
      }}
      className={cn(
        "flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className
      )}
    >
      {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
    </button>
  );
}

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  return (
    <div className={cn("relative rounded-xl border border-border bg-subtle", className)}>
      <pre className="max-h-80 overflow-auto p-4 pr-12 font-mono text-[12.5px] leading-relaxed text-foreground/90">
        <code>{code.trim()}</code>
      </pre>
      <CopyButton value={code.trim()} className="absolute top-2.5 right-2.5" />
    </div>
  );
}

/** Small mono caption used under state examples. */
export function StateLabel({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-[10.5px] tracking-[0.06em] text-faint-foreground uppercase">{children}</span>;
}

export function StateCell({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      {children}
      <StateLabel>{label}</StateLabel>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */

/** Reads a CSS custom property off <html>, re-reading whenever the theme class changes. */
export function useCssVar(name: string) {
  const [value, setValue] = React.useState("");
  React.useEffect(() => {
    const read = () => setValue(getComputedStyle(document.documentElement).getPropertyValue(name).trim());
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] });
    return () => observer.disconnect();
  }, [name]);
  return value;
}

/** Resolves any CSS color (oklch, lab, color-mix…) to #rrggbb or rgba() via a 1px canvas. */
function toHex(color: string) {
  if (typeof document === "undefined" || !color) return "";
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return "";
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  const hex = `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  return a < 255 ? `${hex} · ${Math.round((a / 255) * 100)}%` : hex;
}

export function Swatch({ token, label, onToken }: { token: string; label?: string; onToken?: string }) {
  const raw = useCssVar(`--${token}`);
  const value = React.useMemo(() => toHex(raw), [raw]);
  return (
    <div className="group/swatch overflow-hidden rounded-lg border border-border bg-card">
      <div
        className="relative flex h-16 items-end p-2 shadow-[inset_0_-1px_0_var(--border)]"
        style={{ background: `var(--${token})`, color: onToken ? `var(--${onToken})` : undefined }}
      >
        {onToken ? <span className="text-[13px] font-medium">Aa</span> : null}
        <CopyButton value={`var(--${token})`} className="absolute top-1.5 right-1.5 size-6 bg-card/80 opacity-0 backdrop-blur group-hover/swatch:opacity-100" />
      </div>
      <div className="grid gap-0.5 px-2.5 py-2">
        <p className="truncate text-[12.5px] font-medium">{label ?? token}</p>
        <p className="truncate font-mono text-[10.5px] text-faint-foreground" title={raw}>
          --{token}
        </p>
        <p className="truncate font-mono text-[10.5px] text-muted-foreground uppercase" title={raw} suppressHydrationWarning>
          {value || "…"}
        </p>
      </div>
    </div>
  );
}

export function TokenTable({ rows }: { rows: { token: string; preview: React.ReactNode; note?: string }[] }) {
  return (
    <div className="surface overflow-hidden rounded-xl">
      {rows.map((row, i) => (
        <div key={row.token} className={cn("grid grid-cols-[160px_1fr_auto] items-center gap-4 px-4 py-3", i > 0 && "border-t border-border")}>
          <code className="font-mono text-xs text-muted-foreground">{row.token}</code>
          <div className="min-w-0">{row.preview}</div>
          {row.note ? <span className="font-mono text-[11px] text-faint-foreground">{row.note}</span> : <span />}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export type DocNavGroup = { label: string; items: { id: string; title: string }[] };

export function DocNav({ groups }: { groups: DocNavGroup[] }) {
  const [active, setActive] = React.useState(groups[0]?.items[0]?.id ?? "");
  React.useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-doc-section]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Design system sections" className="grid gap-5 text-[13px]">
      {groups.map((group) => (
        <div key={group.label} className="grid gap-px">
          <p className="mb-1.5 px-2.5 font-mono text-[10.5px] font-medium tracking-[0.08em] text-faint-foreground uppercase">{group.label}</p>
          {group.items.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "relative rounded-md px-2.5 py-1 text-muted-foreground transition-colors hover:text-foreground",
                active === item.id && "bg-accent font-medium text-foreground"
              )}
            >
              {active === item.id ? <span aria-hidden="true" className="absolute top-1.5 bottom-1.5 left-0 w-[2px] rounded-full bg-brand" /> : null}
              {item.title}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}
