"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";

export function CopyCommand({ command, className }: { command: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(command);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className={cn(
        "group inline-flex h-10 items-center gap-3 rounded-full border border-dashed border-border-strong px-4 font-mono text-[12.5px] text-muted-foreground transition-colors hover:border-solid hover:text-foreground",
        className
      )}
      aria-label={`Copy command: ${command}`}
    >
      <span className="text-faint-foreground">$</span>
      {command}
      {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5 opacity-60 group-hover:opacity-100" />}
    </button>
  );
}
