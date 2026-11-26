import { v } from "convex/values";
import {
  action,
  internalAction,
  mutation,
  query,
  type ActionCtx,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { components, internal } from "./_generated/api";
import {
  Agent,
  createThread,
  getThreadMetadata,
  saveMessage,
  updateThreadMetadata,
  listUIMessages,
  vStreamArgs,
  syncStreams,
} from "@convex-dev/agent";
import { paginationOptsValidator } from "convex/server";
import { getUser } from "./model/user";
import { getChatModel, getEmbeddingModel } from "./lib/aiModels";

// Define the general-purpose assistant agent
const assistant = new Agent(components.agent, {
  name: "Assistant",
  languageModel: getChatModel(),
  embeddingModel: getEmbeddingModel(),
  instructions: `You are a helpful general-purpose AI assistant. You can help with anything the user asks, including:
- Answering questions on any topic
- Writing, editing, and improving text of any kind
- Brainstorming ideas and solving problems
- Explaining concepts at any level of depth
- Helping with code, debugging, and technical questions
- Summarizing, translating, and analyzing content
- Planning, organizing, and productivity advice

Remember previous conversations to provide personalized, context-aware responses.
Be direct, accurate, and helpful. If you don't know something, say so.`,
  maxSteps: 5,
  contextOptions: {
    recentMessages: 50,
    searchOptions: {
      limit: 10,
      vectorSearch: true,
      messageRange: { before: 2, after: 1 },
    },
  },
});

function deriveThreadTitle(prompt: string) {
  const text = prompt.replace(/\s+/g, " ").trim();
  if (!text) return "New conversation";
  if (text.length <= 56) return text;
  const cut = text.slice(0, 56);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 20 ? lastSpace : 56).trimEnd()}…`;
}

async function requireUserId(
  ctx: QueryCtx | MutationCtx | ActionCtx
): Promise<string> {
  const user = await getUser(ctx);
  return user._id;
}

async function assertThreadOwner(
  ctx: QueryCtx | MutationCtx | ActionCtx,
  threadId: string,
  userId: string
) {
  const thread = await getThreadMetadata(ctx, components.agent, { threadId });
  if (thread.userId !== userId) {
    throw new Error("Unauthorized");
  }
  return thread;
}

// Create a new thread for a user
export const createAssistantThread = mutation({
  args: {
    title: v.optional(v.string()),
  },
  handler: async (ctx, { title }) => {
    const userId = await requireUserId(ctx);
    const threadId = await createThread(ctx, components.agent, {
      userId,
      title: title || "New conversation",
      summary: "A conversation with the AI assistant",
    });

    // Set as active thread in user profile
    const profile = await ctx.db
      .query("profile")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, { activeAssistantThreadId: threadId });
    }

    return threadId;
  },
});

// Get the user's active thread
export const getActiveThread = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireUserId(ctx);
    const profile = await ctx.db
      .query("profile")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", userId))
      .first();

    return profile?.activeAssistantThreadId;
  },
});

// Set the user's active thread
export const setActiveThread = mutation({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }) => {
    const userId = await requireUserId(ctx);
    await assertThreadOwner(ctx, threadId, userId);
    const profile = await ctx.db
      .query("profile")
      .withIndex("by_auth_user_id", (q) => q.eq("authUserId", userId))
      .first();

    if (profile) {
      await ctx.db.patch(profile._id, { activeAssistantThreadId: threadId });
    }
  },
});

// List all threads for a user
export const listUserThreads = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await requireUserId(ctx);
    return await ctx.runQuery(components.agent.threads.listThreadsByUserId, {
      userId,
      paginationOpts,
    });
  },
});

// Save a user message and trigger async response
export const sendMessage = mutation({
  args: {
    threadId: v.string(),
    prompt: v.string(),
  },
  handler: async (ctx, { threadId, prompt }) => {
    const userId = await requireUserId(ctx);
    const thread = await assertThreadOwner(ctx, threadId, userId);

    if (!thread.title || thread.title === "New conversation") {
      await updateThreadMetadata(ctx, components.agent, {
        threadId,
        patch: { title: deriveThreadTitle(prompt) },
      });
    }

    // Save the user's message
    const { messageId } = await saveMessage(ctx, components.agent, {
      threadId,
      userId,
      prompt,
    });

    // Schedule async response generation with streaming
    await ctx.scheduler.runAfter(
      0,
      internal.assistant.generateResponseAsync,
      {
        threadId,
        userId,
        promptMessageId: messageId,
      }
    );

    return { messageId };
  },
});

// Generate response asynchronously with streaming
export const generateResponseAsync = internalAction({
  args: {
    threadId: v.string(),
    userId: v.string(),
    promptMessageId: v.string(),
  },
  handler: async (ctx, { threadId, userId, promptMessageId }) => {
    await assistant.streamText(
      ctx,
      { threadId, userId },
      { promptMessageId },
      { saveStreamDeltas: true }
    );
  },
});

// List messages in a thread with streaming support
export const listThreadMessages = query({
  args: {
    threadId: v.string(),
    paginationOpts: paginationOptsValidator,
    streamArgs: vStreamArgs,
  },
  handler: async (ctx, args) => {
    const userId = await requireUserId(ctx);
    await assertThreadOwner(ctx, args.threadId, userId);

    // Fetch regular messages
    const paginated = await listUIMessages(ctx, components.agent, args);

    // Fetch streaming deltas
    const streams = await syncStreams(ctx, components.agent, args);

    return { ...paginated, streams };
  },
});

// Delete a thread
export const deleteThread = action({
  args: {
    threadId: v.string(),
  },
  handler: async (ctx, { threadId }) => {
    const userId = await requireUserId(ctx);
    await assertThreadOwner(ctx, threadId, userId);
    await assistant.deleteThreadAsync(ctx, { threadId });
  },
});
