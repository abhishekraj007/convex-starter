"use client";

import { AssistantChat } from "@/components/assistant/assistant-chat";
import { ProtectedRoute } from "@/components/protected-route";
import { useAssistantChat } from "@/hooks/use-assistant-chat";

export default function AssistantPage() {
  return (
    <ProtectedRoute>
      <AssistantWorkspace />
    </ProtectedRoute>
  );
}

function AssistantWorkspace() {
  const chat = useAssistantChat();

  return (
    <AssistantChat
      firstName={chat.firstName}
      threads={chat.threads}
      activeThreadId={chat.activeThreadId}
      threadTitle={chat.threadTitle}
      messages={chat.messages}
      isLoading={chat.isLoading}
      isGenerating={chat.isGenerating}
      onSend={chat.send}
      onNewChat={chat.newChat}
      onSelectThread={chat.selectThread}
    />
  );
}
