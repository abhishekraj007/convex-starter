"use client";

import { Code2, FileText, ListChecks, PenLine } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { IconTile } from "@/components/ui/icon-tile";

const suggestions = [
  {
    label: "Draft with me",
    hint: "Outline a launch email that lands the value in two lines.",
    prompt: "Outline a launch email for our new feature. Keep it friendly, not salesy, and land the value in the first two lines.",
    icon: PenLine,
  },
  {
    label: "Explain a code path",
    hint: "Walk through how auth and billing connect in this starter.",
    prompt: "Explain how authentication and billing connect in this starter, from sign-in to an active subscription.",
    icon: Code2,
  },
  {
    label: "Plan a launch",
    hint: "Build a two-week checklist for a new release.",
    prompt: "Build a practical two-week launch checklist for a new product release, split by week and owner.",
    icon: ListChecks,
  },
  {
    label: "Summarize a draft",
    hint: "Turn a long document into five key bullets.",
    prompt: "Summarize this draft into five key bullets, then list the three decisions I still need to make.",
    icon: FileText,
  },
] as const;

export function EmptyState({ firstName, onSuggestion }: { firstName?: string; onSuggestion: (prompt: string) => void }) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      <div className="relative">
        <div aria-hidden="true" className="absolute inset-2 rounded-full bg-brand/25 blur-2xl" />
        <BrandMark className="relative size-14" />
      </div>
      <h2 className="mt-6 text-[26px] leading-tight font-extrabold tracking-[-0.045em] text-balance sm:text-[30px]">
        How can I help{firstName ? `, ${firstName}` : ""}?
      </h2>
      <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-pretty text-muted-foreground">
        Ask anything — writing, code, research, planning or analysis. I keep the context of this conversation.
      </p>

      <div className="mt-8 grid w-full gap-2 text-left sm:grid-cols-2">
        {suggestions.map(({ label, hint, prompt, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onSuggestion(prompt)}
            className="group flex cursor-pointer items-start gap-3 rounded-2xl border border-border/70 bg-card p-3.5 text-left shadow-[0_1px_2px_color-mix(in_oklab,var(--shadow-color)_5%,transparent)] transition-[border-color,background-color,box-shadow] hover:border-border-strong hover:bg-accent/50 hover:shadow-[var(--elev-1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <IconTile tone="muted" size="sm" className="mt-0.5">
              <Icon />
            </IconTile>
            <span className="min-w-0">
              <span className="block text-[12.5px] font-semibold tracking-[-0.01em]">{label}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">{hint}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
