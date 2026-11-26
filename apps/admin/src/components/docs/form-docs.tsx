"use client";

import * as React from "react";
import { ArrowRight, AtSign, Bold, ChevronDown, Copy, Italic, Mail, Plus, Search, Settings, Trash2, Underline } from "lucide-react";
import { Toggle } from "@ui-sdk/react/toggle";

import { DocSection, Demo, StateCell } from "./doc-kit";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { OTPInput } from "@/components/ui/otp-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxField, ComboboxItem } from "@/components/ui/combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { SegmentedControl, SegmentedControlItem } from "@/components/ui/segmented-control";
import { Spinner } from "@/components/ui/spinner";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

const hoverCls: Record<string, string> = {
  default: "bg-[color-mix(in_oklab,var(--primary)_88%,var(--primary-foreground))]",
  secondary: "border-border-strong bg-accent",
  ghost: "bg-accent text-foreground",
};
const focusCls = "outline-2 outline-offset-2 outline-ring";

function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: string; error?: string; children: React.ReactNode; htmlFor?: string }) {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor={htmlFor} className="text-[13px] font-medium">
        {label}
      </Label>
      {children}
      {error ? <p className="text-xs text-destructive-text">{error}</p> : hint ? <p className="text-xs text-faint-foreground">{hint}</p> : null}
    </div>
  );
}

const frameworks = ["Next.js", "Remix", "Astro", "SvelteKit", "Nuxt", "Expo", "Vite"];

export function FormDocs() {
  const [loading, setLoading] = React.useState(false);
  return (
    <>
      <DocSection id="button" eyebrow="Actions" title="Button" description="Indigo primary for the one committing action per view, floating white secondary for everything else, ghost inside toolbars and tables. Every button presses down 1px.">
        <Demo
          title="Variants"
          code={`<Button>Deploy</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="destructive-soft">Remove</Button>
<Button variant="link">Learn more</Button>`}
        >
          <Button>Deploy</Button>
                    <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Delete</Button>
          <Button variant="destructive-soft">Remove</Button>
          <Button variant="link">Learn more</Button>
        </Demo>
        <Demo title="Sizes and shapes" code={`<Button size="xs">Extra small</Button>
<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>
<Button size="xl" shape="pill">Get started <ArrowRight /></Button>`}>
          <Button size="xs">Extra small</Button>
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl" shape="pill">
            Get started <ArrowRight />
          </Button>
          <Button variant="secondary" shape="pill">
            <Plus /> New project <Kbd className="ml-1">N</Kbd>
          </Button>
        </Demo>
        <Demo title="States" description="Hover and focus are pinned here so they can be compared side by side." code={`<Button disabled>Disabled</Button>
<Button disabled>
  <Spinner /> Saving…
</Button>`} stageClassName="items-start gap-6">
          {(["default", "secondary", "ghost"] as const).map((v) => (
            <div key={v} className="grid grid-cols-5 items-start gap-4">
              <StateCell label="Default"><Button variant={v}>Button</Button></StateCell>
              <StateCell label="Hover"><Button variant={v} className={hoverCls[v]}>Button</Button></StateCell>
              <StateCell label="Focus"><Button variant={v} className={focusCls}>Button</Button></StateCell>
              <StateCell label="Disabled"><Button variant={v} disabled>Button</Button></StateCell>
              <StateCell label="Loading">
                <Button variant={v} disabled={loading} onClick={() => { setLoading(true); window.setTimeout(() => setLoading(false), 1600); }}>
                  <Spinner /> Saving…
                </Button>
              </StateCell>
            </div>
          ))}
        </Demo>
      </DocSection>

      <DocSection id="icon-button" eyebrow="Actions" title="Icon button" description="Square buttons for toolbars. Always pass an aria-label.">
        <Demo code={`<Button size="icon" variant="secondary" aria-label="Settings"><Settings /></Button>`}>
          <Button size="icon" aria-label="Add"><Plus /></Button>
          <Button size="icon" variant="secondary" aria-label="Settings"><Settings /></Button>
          <Button size="icon-sm" variant="outline" aria-label="Copy"><Copy /></Button>
          <Button size="icon-sm" variant="ghost" aria-label="Search"><Search /></Button>
          <Button size="icon-xs" variant="destructive-soft" aria-label="Delete"><Trash2 /></Button>
          <Button size="icon" variant="secondary" shape="pill" aria-label="Mail"><Mail /></Button>
          <Button size="icon" variant="secondary" disabled aria-label="Disabled"><Settings /></Button>
        </Demo>
      </DocSection>

      <DocSection id="button-group" eyebrow="Actions" title="Button group and toggle" description="Joined buttons share hairlines; toggles hold a pressed state.">
        <Demo code={`<ButtonGroup>
  <Button variant="secondary">Merge</Button>
  <Button variant="secondary" size="icon" aria-label="More"><ChevronDown /></Button>
</ButtonGroup>`}>
          <ButtonGroup>
            <Button variant="secondary">Merge pull request</Button>
            <Button variant="secondary" size="icon" aria-label="More options"><ChevronDown /></Button>
          </ButtonGroup>
          <ButtonGroup>
            <Button variant="secondary" size="sm">Day</Button>
            <Button variant="secondary" size="sm">Week</Button>
            <Button variant="secondary" size="sm">Month</Button>
          </ButtonGroup>
          <div className="flex gap-1 rounded-lg border border-border bg-card p-0.5 shadow-[inset_0_1px_0_var(--highlight)]">
            {[Bold, Italic, Underline].map((Icon, i) => (
              <Toggle
                key={i}
                defaultPressed={i === 0}
                aria-label={["Bold", "Italic", "Underline"][i]}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-pressed:bg-accent data-pressed:text-foreground"
              >
                <Icon className="size-3.5" />
              </Toggle>
            ))}
          </div>
        </Demo>
      </DocSection>

      <DocSection id="input" eyebrow="Forms" title="Input" description="36px tall, card fill, soft inner shadow. Focus swaps the border to the brand ring with a 3px halo.">
        <Demo stageClassName="grid gap-6 md:grid-cols-2 items-start" code={`<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="you@company.com" />
<Input aria-invalid placeholder="Invalid" />
<Input disabled placeholder="Disabled" />`}>
          <Field label="Email" hint="We’ll never share it." htmlFor="d-email">
            <Input id="d-email" type="email" placeholder="you@company.com" />
          </Field>
          <Field label="Search" htmlFor="d-search">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint-foreground" />
              <Input id="d-search" placeholder="Search projects" className="pr-14 pl-9" />
              <Kbd className="absolute top-1/2 right-2 -translate-y-1/2">⌘K</Kbd>
            </div>
          </Field>
          <Field label="Focused">
            <Input defaultValue="acme-studio" className="border-ring shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring)_22%,transparent)]" />
          </Field>
          <Field label="Username" error="That handle is already taken." htmlFor="d-user">
            <div className="relative">
              <AtSign className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-faint-foreground" />
              <Input id="d-user" aria-invalid defaultValue="vercel" className="pl-9" />
            </div>
          </Field>
          <Field label="Disabled">
            <Input disabled placeholder="Not editable" />
          </Field>
          <Field label="Password" htmlFor="d-pw">
            <PasswordInput controlId="d-pw" />
          </Field>
        </Demo>
        <Demo title="One-time code" code={`<OTPInput maxLength={6} />`}>
          <OTPInput maxLength={6} />
        </Demo>
      </DocSection>

      <DocSection id="textarea" eyebrow="Forms" title="Textarea">
        <Demo stageClassName="grid gap-6 md:grid-cols-2 items-start" code={`<Textarea placeholder="Write a message…" rows={4} />`}>
          <Field label="Message" hint="Markdown supported.">
            <Textarea placeholder="Write a message…" rows={4} />
          </Field>
          <Field label="Feedback" error="Please add at least 20 characters.">
            <Textarea aria-invalid defaultValue="Too short" rows={4} />
          </Field>
        </Demo>
      </DocSection>

      <DocSection id="select" eyebrow="Forms" title="Select and combobox" description="Select for short fixed lists; Combobox when the list is long enough to need typing.">
        <Demo stageClassName="grid gap-6 md:grid-cols-3 items-start" code={`<Select defaultValue="pro">
  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
  <SelectContent>
    <SelectItem value="hobby">Hobby</SelectItem>
    <SelectItem value="pro">Pro</SelectItem>
  </SelectContent>
</Select>

<Combobox items={frameworks}>
  <ComboboxField placeholder="Pick a framework" />
  <ComboboxContent>
    <ComboboxEmpty>No results.</ComboboxEmpty>
    {frameworks.map((f) => <ComboboxItem key={f} value={f}>{f}</ComboboxItem>)}
  </ComboboxContent>
</Combobox>`}>
          <Field label="Plan">
            <Select defaultValue="pro">
              <SelectTrigger className="w-full min-w-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hobby">Hobby</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="enterprise" disabled>Enterprise</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Framework">
            <Combobox items={frameworks}>
              <ComboboxField placeholder="Pick a framework" />
              <ComboboxContent>
                <ComboboxEmpty>No results.</ComboboxEmpty>
                {frameworks.map((f) => (
                  <ComboboxItem key={f} value={f}>{f}</ComboboxItem>
                ))}
              </ComboboxContent>
            </Combobox>
          </Field>
          <Field label="Disabled">
            <Select disabled defaultValue="pro">
              <SelectTrigger className="w-full min-w-0"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="pro">Pro</SelectItem></SelectContent>
            </Select>
          </Field>
        </Demo>
      </DocSection>

      <DocSection id="choice" eyebrow="Forms" title="Checkbox, radio and switch">
        <Demo stageClassName="grid gap-8 md:grid-cols-3 items-start" code={`<Checkbox id="terms" defaultChecked />
<RadioGroup defaultValue="email">
  <RadioGroupItem value="email" />
</RadioGroup>
<Switch defaultChecked aria-label="Notifications" />`}>
          <div className="grid gap-3">
            {[
              ["Email notifications", true, false],
              ["Weekly digest", false, false],
              ["Product updates", true, true],
              ["Beta features", false, true],
            ].map(([label, checked, disabled], i) => (
              <label key={i} className={cn("flex items-center gap-2.5 text-sm", disabled && "opacity-50")}>
                <Checkbox defaultChecked={checked as boolean} disabled={disabled as boolean} />
                {label as string}
              </label>
            ))}
          </div>
          <RadioGroup defaultValue="email" className="grid gap-3">
            {[
              ["email", "Email OTP"],
              ["password", "Password"],
              ["oauth", "Google / Apple"],
              ["sso", "SAML SSO (soon)"],
            ].map(([value, label]) => (
              <label key={value} className={cn("flex items-center gap-2.5 text-sm", value === "sso" && "opacity-50")}>
                <RadioGroupItem value={value} disabled={value === "sso"} />
                {label}
              </label>
            ))}
          </RadioGroup>
          <div className="grid gap-3">
            {[
              ["Realtime sync", true, false],
              ["Analytics", false, false],
              ["Maintenance mode", true, true],
            ].map(([label, checked, disabled], i) => (
              <label key={i} className={cn("flex items-center justify-between gap-6 text-sm", disabled && "opacity-50")}>
                {label as string}
                <Switch defaultChecked={checked as boolean} disabled={disabled as boolean} aria-label={label as string} />
              </label>
            ))}
          </div>
        </Demo>
      </DocSection>

      <DocSection id="slider" eyebrow="Forms" title="Slider and segmented control">
        <Demo stageClassName="grid gap-8 md:grid-cols-2 items-center" code={`<Slider defaultValue={40} thumbLabel="Volume" />
<SegmentedControl defaultValue="month">
  <SegmentedControlItem value="week">Week</SegmentedControlItem>
  <SegmentedControlItem value="month">Month</SegmentedControlItem>
</SegmentedControl>`}>
          <div className="grid gap-5">
            <Slider defaultValue={40} thumbLabel="Volume" />
            <Slider defaultValue={70} step={10} thumbLabel="Stepped" />
            <Slider defaultValue={60} disabled thumbLabel="Disabled" className="opacity-50" />
          </div>
          <div className="grid justify-items-start gap-4">
            <SegmentedControl defaultValue="month" aria-label="Period">
              <SegmentedControlItem value="day">Day</SegmentedControlItem>
              <SegmentedControlItem value="week">Week</SegmentedControlItem>
              <SegmentedControlItem value="month">Month</SegmentedControlItem>
              <SegmentedControlItem value="year">Year</SegmentedControlItem>
            </SegmentedControl>
            <SegmentedControl defaultValue="grid" aria-label="View">
              <SegmentedControlItem value="list">List</SegmentedControlItem>
              <SegmentedControlItem value="grid">Grid</SegmentedControlItem>
            </SegmentedControl>
          </div>
        </Demo>
      </DocSection>
    </>
  );
}
