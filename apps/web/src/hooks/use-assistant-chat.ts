"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { optimisticallySendMessage, useUIMessages } from "@convex-dev/agent/react";
import { toast } from "@ui-sdk/react/toast";
import { api } from "@convex-starter/backend/convex/_generated/api";
import type { ChatMessage, ChatThread } from "@/components/assistant/types";

function deriveThreadTitle(prompt: string) {
  const text = prompt.replace(/\s+/g, " ").trim();
  if (!text) return "New conversation";
  if (text.length <= 56) return text;
  const cut = text.slice(0, 56);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 20 ? lastSpace : 56).trimEnd()}…`;
}

export function useAssistantChat() {
  const userData = useQuery(api.user.fetchUserAndProfile);
  const activeThreadFromDb = useQuery(api.assistant.getActiveThread, userData ? {} : "skip");
  const threadList = useQuery(
    api.assistant.listUserThreads,
    userData ? { paginationOpts: { numItems: 20, cursor: null } } : "skip"
  );

  const [threadId, setThreadId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const createThread = useMutation(api.assistant.createAssistantThread);
  const setActiveThread = useMutation(api.assistant.setActiveThread);
  const sendMessageMutation = useMutation(api.assistant.sendMessage).withOptimisticUpdate(
    optimisticallySendMessage(api.assistant.listThreadMessages)
  );

  useEffect(() => {
    if (!userData || initialized) return;
    if (activeThreadFromDb === undefined || threadList === undefined) return;

    const nextThreadId = activeThreadFromDb ?? threadList.page[0]?._id ?? null;
    if (nextThreadId) {
      setThreadId(nextThreadId);
      if (!activeThreadFromDb) {
        void setActiveThread({ threadId: nextThreadId }).catch(() => {});
      }
    }
    setInitialized(true);
  }, [userData, initialized, activeThreadFromDb, threadList, setActiveThread]);

  const { results, status } = useUIMessages(
    api.assistant.listThreadMessages,
    threadId ? { threadId } : "skip",
    { initialNumItems: 50, stream: true }
  );

  const threads: ChatThread[] = (threadList?.page ?? []).map((thread) => ({
    _id: thread._id,
    title: thread.title,
    _creationTime: thread._creationTime,
  }));

  const messages: ChatMessage[] = (threadId ? results ?? [] : []).reduce<ChatMessage[]>((acc, message) => {
    if (message.role !== "user" && message.role !== "assistant") return acc;
    acc.push({
      id: message.key,
      role: message.role,
      text: message.text ?? "",
      streaming: message.status === "streaming",
      createdAt: message._creationTime,
    });
    return acc;
  }, []);

  const isStreaming = messages.some((message) => message.streaming);
  const isLoadingThread = Boolean(threadId) && status === "LoadingFirstPage";
  const isInitializing =
    userData === undefined ||
    !initialized ||
    activeThreadFromDb === undefined ||
    threadList === undefined;
  const isLoading = isInitializing || isLoadingThread;
  const activeThread = threads.find((thread) => thread._id === threadId);
  const threadTitle =
    activeThread?.title && activeThread.title !== "New conversation" ? activeThread.title : "New conversation";
  const firstName = (userData?.profile?.name || userData?.userMetadata?.name)?.trim().split(/\s+/)[0];

  const send = async (text: string) => {
    const prompt = text.trim();
    if (!prompt || isSending || isStreaming) return false;

    setIsSending(true);
    try {
      let id = threadId;
      if (!id) {
        id = await createThread({ title: deriveThreadTitle(prompt) });
        setThreadId(id);
      }
      await sendMessageMutation({ threadId: id, prompt });
      return true;
    } catch {
      toast.error("The assistant couldn't send that message. Please try again.");
      return false;
    } finally {
      setIsSending(false);
    }
  };

  const newChat = () => {
    setThreadId(null);
  };

  const selectThread = (id: string) => {
    if (id === threadId) return;
    setThreadId(id);
    void setActiveThread({ threadId: id }).catch(() => {
      toast.error("That conversation couldn't be opened. Please try again.");
    });
  };

  return {
    firstName,
    threads,
    activeThreadId: threadId,
    threadTitle,
    messages,
    isLoading,
    isGenerating: isSending || isStreaming,
    send,
    newChat,
    selectThread,
  };
}

export type AssistantChatState = ReturnType<typeof useAssistantChat>;
