import { createOpenRouter } from "@openrouter/ai-sdk-provider";

/**
 * AI provider selection for the assistant agent.
 *
 * Switch providers with the AI_PROVIDER Convex env var:
 *   npx convex env set AI_PROVIDER openrouter   (default)
 *   npx convex env set AI_PROVIDER gateway
 *
 * - "openrouter" routes chat + embedding requests through OpenRouter
 *   (requires OPENROUTER_API_KEY).
 * - "gateway" resolves model strings through the Vercel AI Gateway
 *   (requires AI_GATEWAY_API_KEY).
 *
 * Model IDs default per provider (below) and can be overridden with the
 * AI_CHAT_MODEL / AI_EMBEDDING_MODEL Convex env vars, e.g.
 *   npx convex env set AI_CHAT_MODEL anthropic/claude-haiku-5.5
 *   npx convex env set AI_CHAT_MODEL google/gemini-3.8-flash
 *
 * Model IDs are provider-specific: on OpenRouter use OpenRouter slugs
 * (https://openrouter.ai/models), on the gateway use gateway model IDs.
 *
 * Note: the chat model can be swapped freely. The embedding model should
 * stay the same across the lifetime of existing threads — different
 * embedding models produce incompatible vector spaces, so semantic search
 * over older messages degrades if you switch it.
 */
const CHAT_MODELS = {
  openrouter: "openai/gpt-5.1",
  gateway: "openai/gpt-5.1-instant",
} as const;

const EMBEDDING_MODELS = {
  openrouter: "openai/text-embedding-3-small",
  gateway: "openai/text-embedding-3-small",
} as const;

type AIProvider = keyof typeof CHAT_MODELS;

export function getAIProvider(): AIProvider {
  return process.env.AI_PROVIDER === "gateway" ? "gateway" : "openrouter";
}

export function getChatModel() {
  const provider = getAIProvider();
  const modelId = process.env.AI_CHAT_MODEL || CHAT_MODELS[provider];
  if (provider === "gateway") {
    return modelId;
  }
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  return openrouter.chat(modelId);
}

export function getEmbeddingModel() {
  const provider = getAIProvider();
  const modelId = process.env.AI_EMBEDDING_MODEL || EMBEDDING_MODELS[provider];
  if (provider === "gateway") {
    return modelId;
  }
  const openrouter = createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
  });
  return openrouter.textEmbeddingModel(modelId);
}
