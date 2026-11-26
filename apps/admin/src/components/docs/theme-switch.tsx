"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Laptop, Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";

/** Three-way theme switch (light / dark / system) with a sliding raised chip. */
export function ThemeSwitch({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  const current = mounted ? theme ?? "system" : "system";
  const options = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Laptop },
  ];
  return (
    <div role="radiogroup" aria-label="Theme" className={cn("inline-flex items-center gap-0.5 rounded-full border border-border bg-muted/60 p-0.5", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={current === o.value}
          onClick={() => setTheme(o.value)}
          className={cn(
            "inline-flex h-7 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted-foreground transition-all duration-150 hover:text-foreground",
            current === o.value && "bg-card text-foreground shadow-[inset_0_1px_0_var(--highlight),0_0_0_1px_var(--border),var(--elev-1)]"
          )}
        >
          <o.icon className="size-3.5" />
          {o.label}
        </button>
      ))}
    </div>
  );
}
