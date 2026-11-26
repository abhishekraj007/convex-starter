"use client";

import { Plus } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HistoryPopover } from "./history-popover";
import type { ChatThread } from "./types";

export function AssistantHeader({
  threads,
  activeThreadId,
  threadTitle,
  isGenerating,
  disabled,
  onSelectThread,
  onNewChat,
}: {
  threads: ChatThread[];
  activeThreadId: string | null;
  threadTitle: string;
  isGenerating: boolean;
  disabled?: boolean;
  onSelectThread: (threadId: string) => void;
  onNewChat: () => void;
}) {
  const subtitle =
    threadTitle && threadTitle !== "New conversation"
      ? threadTitle
      : "Ask anything — writing, code, research and planning.";
  const status = disabled ? "Connecting" : isGenerating ? "Working" : "Ready";
  const statusDot = disabled
    ? "animate-pulse bg-faint-foreground"
    : isGenerating
      ? "animate-pulse bg-brand"
      : "bg-success";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-border/60 bg-background px-4 sm:h-16 sm:px-6">
      <div className="flex min-w-0 items-center gap-2.5">
        <BrandMark className="size-8 shrink-0 sm:size-9" />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-[14px] font-bold tracking-[-0.025em] sm:text-[15px]">AI Assistant</h1>
            <Badge
              variant="secondary"
              className="hidden h-5 gap-1.5 px-2 text-[9px] font-semibold sm:inline-flex"
              aria-live="polite"
            >
              <span className={cn("size-1.5 rounded-full motion-reduce:animate-none", statusDot)} />
              {status}
            </Badge>
          </div>
          <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <HistoryPopover
          threads={threads}
          activeThreadId={activeThreadId}
          onSelect={onSelectThread}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="secondary"
          size="sm"
          shape="pill"
          onClick={onNewChat}
          disabled={disabled}
          aria-label="New chat"
          className="h-9 w-9 px-0 sm:h-8 sm:w-auto sm:px-3"
        >
          <Plus />
          <span className="hidden sm:inline">New chat</span>
        </Button>
      </div>
    </header>
  );
}
