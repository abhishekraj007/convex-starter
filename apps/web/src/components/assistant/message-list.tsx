"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMessageTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { MarkdownMessage } from "./markdown-message";
import type { ChatMessage } from "./types";

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 py-1" role="status" aria-live="polite" aria-label="Assistant is thinking">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1.5 animate-bounce rounded-full bg-faint-foreground motion-reduce:animate-none"
          style={{ animationDelay: `${index * 120}ms` }}
        />
      ))}
    </div>
  );
}

function CopyMessageButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied; leave the action quiet.
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      aria-label={copied ? "Copied" : "Copy message"}
      title={copied ? "Copied" : "Copy message"}
      onClick={copy}
    >
      {copied ? <Check /> : <Copy />}
    </Button>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-[14px] leading-relaxed whitespace-pre-wrap text-primary-foreground shadow-[0_6px_16px_-12px_color-mix(in_oklab,var(--brand)_80%,transparent)] break-words sm:max-w-[75%]">
        {message.text}
      </div>
      {message.createdAt ? (
        <time className="pr-1 text-[10px] text-faint-foreground" dateTime={new Date(message.createdAt).toISOString()}>
          {formatMessageTime(message.createdAt)}
        </time>
      ) : null}
    </div>
  );
}

function AssistantMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="group flex gap-3">
      <BrandMark className="mt-0.5 size-7 shrink-0 sm:size-8" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Assistant</span>
          {message.createdAt ? (
            <>
              <span aria-hidden="true">·</span>
              <time dateTime={new Date(message.createdAt).toISOString()}>{formatMessageTime(message.createdAt)}</time>
            </>
          ) : null}
          {message.streaming ? (
            <span className="inline-flex items-center gap-1.5 font-medium text-brand-text">
              <span className="size-1.5 animate-pulse rounded-full bg-brand motion-reduce:animate-none" />
              Writing
            </span>
          ) : null}
        </div>
        <div className="mt-1.5 min-w-0">
          {message.text ? <MarkdownMessage text={message.text} /> : message.streaming ? <ThinkingDots /> : null}
        </div>
        {!message.streaming && message.text ? (
          <div className="mt-1.5 flex items-center opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 max-sm:opacity-100">
            <CopyMessageButton text={message.text} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AssistantThinking() {
  return (
    <div className="flex gap-3">
      <BrandMark className="mt-0.5 size-7 shrink-0 sm:size-8" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="font-semibold text-foreground">Assistant</span>
          <span>Thinking…</span>
        </div>
        <div className="mt-1.5">
          <ThinkingDots />
        </div>
      </div>
    </div>
  );
}

export function MessagesSkeleton() {
  return (
    <div className="grid gap-7" aria-hidden="true">
      <div className="flex justify-end">
        <Skeleton className="h-16 w-2/3 rounded-2xl sm:w-1/2" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="size-8 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2.5">
          <Skeleton className="h-3 w-24 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-11/12 rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export function MessageList({ messages, isGenerating }: { messages: ChatMessage[]; isGenerating: boolean }) {
  const visibleMessages = messages.filter(
    (message) => message.role === "user" || message.text.trim().length > 0 || message.streaming
  );
  const lastMessage = visibleMessages[visibleMessages.length - 1];
  const isWaitingForFirstToken = isGenerating && (!lastMessage || lastMessage.role === "user");

  return (
    <div className="grid gap-7">
      {visibleMessages.map((message) =>
        message.role === "user" ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <AssistantMessage key={message.id} message={message} />
        )
      )}
      {isWaitingForFirstToken ? <AssistantThinking /> : null}
    </div>
  );
}

export { ThinkingDots };
