"use client";

import * as React from "react";
import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ComposerProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
  isGenerating: boolean;
};

export function Composer({ textareaRef, value, onChange, onSubmit, disabled, isGenerating }: ComposerProps) {
  const canSend = value.trim().length > 0 && !disabled && !isGenerating;

  React.useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = `${Math.max(36, Math.min(el.scrollHeight, 160))}px`;
  }, [value, textareaRef]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      if (canSend) onSubmit();
    }
  };

  return (
    <div className="shrink-0 bg-background px-3 pt-1 pb-3 sm:px-4 sm:pb-4">
      <div className="mx-auto w-full max-w-3xl">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (canSend) onSubmit();
          }}
          className="surface flex items-end gap-2 rounded-3xl py-2 pr-2 pl-4 transition-[border-color,box-shadow] focus-within:border-ring/50 focus-within:ring-4 focus-within:ring-ring/10"
        >
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            name="message"
            autoComplete="off"
            enterKeyHint="send"
            disabled={disabled}
            aria-label="Message the assistant"
            placeholder="Message the assistant…"
            className="max-h-40 min-h-9 w-full flex-1 resize-none overflow-y-auto bg-transparent py-2 text-[14.5px] leading-relaxed outline-none placeholder:text-faint-foreground disabled:cursor-not-allowed disabled:opacity-50 [scrollbar-width:thin]"
          />
          <Button
            type="submit"
            size="icon"
            shape="pill"
            className="mb-0.5 shrink-0"
            disabled={!canSend}
            aria-label="Send message"
          >
            <ArrowUp />
          </Button>
        </form>

        <div className="mt-2 flex items-center justify-between gap-3 px-1.5 text-[11px] leading-relaxed text-muted-foreground">
          <span className="hidden text-faint-foreground sm:inline">Enter to send · Shift + Enter for a new line</span>
          <span
            role="status"
            aria-live="polite"
            className={cn(
              "ml-auto inline-flex items-center gap-1.5 text-right",
              isGenerating && "font-medium text-brand-text"
            )}
          >
            {isGenerating ? (
              <>
                <span className="size-1.5 animate-pulse rounded-full bg-brand motion-reduce:animate-none" />
                Generating response…
              </>
            ) : (
              "AI can make mistakes. Verify important information."
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
