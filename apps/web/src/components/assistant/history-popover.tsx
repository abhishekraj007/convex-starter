"use client";

import * as React from "react";
import { Check, History, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatThreadDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ChatThread } from "./types";

export function HistoryPopover({
  threads,
  activeThreadId,
  onSelect,
  disabled,
}: {
  threads: ChatThread[];
  activeThreadId: string | null;
  onSelect: (threadId: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            shape="pill"
            className="h-9 w-9 gap-1.5 px-0 text-muted-foreground sm:h-8 sm:w-auto sm:px-3"
            aria-label="Chat history"
            disabled={disabled}
          />
        }
      >
        <History className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">History</span>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 max-w-[calc(100vw-2rem)] p-2"
        aria-label="Recent chats"
      >
        <div className="flex items-center justify-between px-2 py-1.5">
          <p className="text-[11px] font-semibold tracking-[-0.01em]">Recent chats</p>
          <span className="text-[10px] font-medium text-faint-foreground tabular-nums">{threads.length}</span>
        </div>
        <div className="max-h-80 overflow-y-auto pr-0.5 [scrollbar-width:thin]">
          {threads.length === 0 ? (
            <p className="px-2 py-6 text-center text-[12px] text-muted-foreground">No conversations yet.</p>
          ) : (
            <div className="grid gap-0.5">
              {threads.map((thread) => {
                const active = thread._id === activeThreadId;
                const title = thread.title && thread.title !== "New conversation" ? thread.title : "Conversation";
                return (
                  <button
                    key={thread._id}
                    type="button"
                    onClick={() => {
                      onSelect(thread._id);
                      setOpen(false);
                    }}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "flex w-full cursor-pointer items-start gap-2.5 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      active && "bg-accent"
                    )}
                  >
                    <MessageSquare className="mt-0.5 size-3.5 shrink-0 text-faint-foreground" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-medium">{title}</span>
                      <span className="block text-[10px] text-faint-foreground">{formatThreadDate(thread._creationTime)}</span>
                    </span>
                    {active ? <Check className="mt-0.5 size-3.5 shrink-0 text-brand" /> : null}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
