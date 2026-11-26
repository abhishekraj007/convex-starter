"use client";

import { DocNav, type DocNavGroup } from "@/components/docs/doc-kit";
import { Foundations } from "@/components/docs/foundations";
import { FormDocs } from "@/components/docs/form-docs";
import { DisplayDocs } from "@/components/docs/display-docs";
import { ThemeSwitch } from "@/components/docs/theme-switch";

const nav: DocNavGroup[] = [
  {
    label: "Foundations",
    items: [
      { id: "colors", title: "Color" },
      { id: "typography", title: "Typography" },
      { id: "spacing", title: "Spacing" },
      { id: "radius", title: "Radius" },
      { id: "elevation", title: "Elevation" },
      { id: "motion", title: "Motion" },
      { id: "icons", title: "Iconography" },
    ],
  },
  {
    label: "Actions",
    items: [
      { id: "button", title: "Button" },
      { id: "icon-button", title: "Icon button" },
      { id: "button-group", title: "Button group" },
    ],
  },
  {
    label: "Forms",
    items: [
      { id: "input", title: "Input" },
      { id: "textarea", title: "Textarea" },
      { id: "select", title: "Select & combobox" },
      { id: "choice", title: "Checkbox, radio, switch" },
      { id: "slider", title: "Slider & segmented" },
    ],
  },
  {
    label: "Navigation",
    items: [
      { id: "tabs", title: "Tabs" },
      { id: "breadcrumb", title: "Breadcrumb & pagination" },
      { id: "accordion", title: "Accordion" },
    ],
  },
  {
    label: "Data display",
    items: [
      { id: "badge", title: "Badge" },
      { id: "avatar", title: "Avatar" },
      { id: "card", title: "Card" },
      { id: "table", title: "Table" },
    ],
  },
  {
    label: "Feedback",
    items: [
      { id: "alert", title: "Alert & toast" },
      { id: "progress", title: "Progress & loading" },
      { id: "empty", title: "Empty state" },
    ],
  },
  {
    label: "Overlays",
    items: [
      { id: "dialog", title: "Dialog & sheet" },
      { id: "popover", title: "Popover & tooltip" },
      { id: "menu", title: "Dropdown menu" },
      { id: "kbd", title: "Kbd & separator" },
    ],
  },
];


export default function DesignSystemPage() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-7xl px-6">
        <header className="flex flex-wrap items-end justify-between gap-6 border-b border-border pt-16 pb-10">
          <div className="max-w-2xl">
            <p className="eyebrow">Design system · v3</p>
            <h1 className="mt-3 text-[3rem] leading-[1.02] font-semibold tracking-[-0.045em]">
              Canvas <span className="text-muted-foreground">+ Indigo</span>
            </h1>
            <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">
              The tokens, type and components behind the Convex Starter web app. A lavender canvas, floating white cards, generous radii and one vivid indigo accent.
              Built on <code className="rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[13px]">@ui-sdk/react</code>.
            </p>
            <dl className="mt-6 flex gap-8">
              {[
                ["Tokens", "52"],
                ["Components", "39"],
                ["Themes", "2"],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-[10.5px] tracking-[0.08em] text-faint-foreground uppercase">{k}</dt>
                  <dd className="text-2xl font-semibold tracking-[-0.03em] tabular-nums">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ThemeSwitch />
        </header>

        <div className="grid gap-12 py-12 lg:grid-cols-[200px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-20 max-h-[calc(100svh-6rem)] overflow-y-auto pr-2 pb-8">
              <DocNav groups={nav} />
            </div>
          </aside>
          <main className="grid min-w-0 gap-8">
            <Foundations />
            <FormDocs />
            <DisplayDocs />
          </main>
        </div>
      </div>
    </div>
  );
}
