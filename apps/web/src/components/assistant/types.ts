export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  streaming: boolean;
  createdAt?: number;
};

export type ChatThread = {
  _id: string;
  title?: string;
  _creationTime: number;
};
