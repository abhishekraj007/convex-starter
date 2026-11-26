"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  FileText,
  Home,
  LayoutDashboard,
  Palette,
  Search,
  Settings,
  Sparkles,
  Upload,
} from "lucide-react";

import { Command, CommandEmpty, CommandGroup, CommandGroupLabel, CommandInput, CommandItem, CommandItemIcon, CommandItemText, CommandList, CommandSeparator } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";

const groups = [
  {
    label: "Workspace",
    items: [
      { value: "/", label: "Home", icon: Home },
      { value: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { value: "/assistant", label: "AI Assistant", icon: Sparkles },
      { value: "/uploads", label: "Uploads", icon: Upload },
    ],
  },
  {
    label: "Resources",
    items: [
      { value: "/pricing", label: "Pricing", icon: CreditCard },
      { value: "/docs", label: "Docs", icon: FileText },
      { value: "/components", label: "Design system", icon: Palette },
    ],
  },
  {
    label: "Account",
    items: [{ value: "/settings", label: "Settings", icon: Settings }],
  },
];

export function AppSearch({
  triggerLabel = "Search…",
  placeholder = "Search pages and tools…",
  className,
  compact = false,
}: {
  triggerLabel?: string;
  placeholder?: string;
  className?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const triggerClass = compact
    ? "flex size-9 items-center justify-center rounded-xl bg-muted/70 text-faint-foreground transition-colors hover:bg-muted hover:text-muted-foreground"
    : "flex h-9 w-full items-center gap-2.5 rounded-xl bg-muted/70 px-3 text-[13px] text-faint-foreground transition-colors hover:bg-muted hover:text-muted-foreground";

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey) && !event.altKey) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={triggerLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Meta+K Control+K"
        title={compact ? triggerLabel : undefined}
        className={className ?? triggerClass}
      >
        <Search className="size-4" aria-hidden="true" />
        {compact ? null : (
          <>
            <span className="truncate">{triggerLabel}</span>
            <Kbd className="ml-auto h-[18px] border-0 bg-card/70 text-[10px]">⌘K</Kbd>
          </>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0 sm:max-w-xl">
          <DialogTitle className="sr-only">Search</DialogTitle>
          <Command
            onAction={(value) => {
              setOpen(false);
              router.push(value as "/");
            }}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <CommandInput aria-label="Search pages and tools" placeholder={placeholder} autoFocus />
            </div>
            <CommandEmpty>No pages match that search.</CommandEmpty>
            <CommandList>
              {groups.map((group, index) => (
                <React.Fragment key={group.label}>
                  {index > 0 ? <CommandSeparator /> : null}
                  <CommandGroup>
                    <CommandGroupLabel>{group.label}</CommandGroupLabel>
                    {group.items.map(({ value, label, icon: Icon }) => (
                      <CommandItem key={value} value={value} label={label}>
                        <CommandItemIcon>
                          <Icon />
                        </CommandItemIcon>
                        <CommandItemText />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </React.Fragment>
              ))}
            </CommandList>
            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5 text-[10.5px] text-faint-foreground">
              <span>Use ↑ ↓ to navigate</span>
              <span>Enter to open · Esc to close</span>
            </div>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
