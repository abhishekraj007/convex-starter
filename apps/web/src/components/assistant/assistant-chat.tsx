"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AssistantHeader } from "./assistant-header";
import { Composer } from "./composer";
import { EmptyState } from "./empty-state";
import { MessageList, MessagesSkeleton } from "./message-list";
import type { ChatMessage, ChatThread } from "./types";

type AssistantChatProps = {
  firstName?: string;
  threads: ChatThread[];
  activeThreadId: string | null;
  threadTitle: string;
  messages: ChatMessage[];
  isLoading: boolean;
  isGenerating: boolean;
  onSend: (text: string) => Promise<boolean>;
  onNewChat: () => void;
  onSelectThread: (threadId: string) => void;
};

export function AssistantChat({
  firstName,
  threads,
  activeThreadId,
  threadTitle,
  messages,
  isLoading,
  isGenerating,
  onSend,
  onNewChat,
  onSelectThread,
}: AssistantChatProps) {
  const [draft, setDraft] = React.useState("");
  const [pinnedToBottom, setPinnedToBottom] = React.useState(true);
  const [showScrollButton, setShowScrollButton] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const scrollToLatest = (behavior: ScrollBehavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? "auto" : behavior });
    setPinnedToBottom(true);
    setShowScrollButton(false);
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (!pinnedToBottom) {
      setShowScrollButton(el.scrollHeight - el.scrollTop - el.clientHeight > 200);
      return;
    }
    el.scrollTop = el.scrollHeight;
  }, [messages, draft, pinnedToBottom]);

  React.useEffect(() => {
    setPinnedToBottom(true);
    setShowScrollButton(false);
  }, [activeThreadId]);

  React.useEffect(() => {
    if (isLoading) return;
    if (window.matchMedia("(min-width: 768px)").matches) {
      textareaRef.current?.focus();
    }
  }, [isLoading]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setPinnedToBottom(distance < 72);
    setShowScrollButton(distance > 200);
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || isLoading || isGenerating) return;

    setDraft("");
    setPinnedToBottom(true);
    const sent = await onSend(text);
    if (!sent) {
      setDraft(text);
      textareaRef.current?.focus();
      return;
    }
    window.requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
      textareaRef.current?.focus();
    });
  };

  const handleNewChat = () => {
    onNewChat();
    setDraft("");
    setPinnedToBottom(true);
    setShowScrollButton(false);
    textareaRef.current?.focus();
  };

  const handleSelectThread = (threadId: string) => {
    onSelectThread(threadId);
    setPinnedToBottom(true);
    setShowScrollButton(false);
  };

  const handleSuggestion = (prompt: string) => {
    setDraft(prompt);
    window.requestAnimationFrame(() => {
      textareaRef.current?.focus();
      const el = textareaRef.current;
      if (el) {
        el.style.height = "0px";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
      }
    });
  };

  const showEmptyState = !isLoading && messages.length === 0;

  return (
    <div className="flex h-[calc(100svh-4rem)] min-h-0 flex-col overflow-hidden md:h-[calc(100svh-5.5rem)]">
      <AssistantHeader
        threads={threads}
        activeThreadId={activeThreadId}
        threadTitle={threadTitle}
        isGenerating={isGenerating}
        disabled={isLoading}
        onSelectThread={handleSelectThread}
        onNewChat={handleNewChat}
      />

      <div className="relative min-h-0 flex-1">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          tabIndex={0}
          role="region"
          aria-label="Conversation"
          className="h-full overflow-y-auto overscroll-contain outline-none [scrollbar-width:thin] focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-inset"
        >
          <div
            className={cn(
              "mx-auto flex min-h-full w-full max-w-3xl flex-col px-4 py-6 sm:px-6 sm:py-8",
              showEmptyState && "justify-center"
            )}
          >
            {isLoading ? (
              <MessagesSkeleton />
            ) : showEmptyState ? (
              <EmptyState firstName={firstName} onSuggestion={handleSuggestion} />
            ) : (
              <MessageList messages={messages} isGenerating={isGenerating} />
            )}
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6 bg-gradient-to-b from-background to-transparent" />

        {showScrollButton && !isLoading ? (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            shape="pill"
            onClick={() => scrollToLatest()}
            aria-label="Scroll to latest message"
            className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 shadow-[var(--elev-3)]"
          >
            <ArrowDown />
          </Button>
        ) : null}
      </div>

      <Composer
        textareaRef={textareaRef}
        value={draft}
        onChange={setDraft}
        onSubmit={() => void handleSend()}
        disabled={isLoading}
        isGenerating={isGenerating}
      />
    </div>
  );
}
