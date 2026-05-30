import OpenAI from 'openai';
import type { ChatMessage } from '../types/chat.js';

const SYSTEM_PROMPT =
  'You are a helpful assistant in a chat app. Be concise and clear.';

/**
 * Groq — free cloud tier, OpenAI-compatible API.
 * No local model downloads; you only need an API key.
 * @see https://console.groq.com
 */
const DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1';
/** Small, fast model on Groq’s free tier (good enough for chat). */
const DEFAULT_MODEL = 'llama-3.1-8b-instant';

let client: OpenAI | null = null;

function getApiKey(): string {
  const key = process.env.LLM_API_KEY ?? process.env.GROQ_API_KEY;
  if (!key) {
    throw new Error(
      'LLM_API_KEY is not set. Create a free key at https://console.groq.com and add it to backend/.env',
    );
  }
  return key;
}

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      baseURL: process.env.LLM_BASE_URL ?? DEFAULT_BASE_URL,
      apiKey: getApiKey(),
    });
  }
  return client;
}

/** Prepend system instructions; drop duplicate system messages from the client. */
export function buildMessages(messages: ChatMessage[]): ChatMessage[] {
  const withoutSystem = messages.filter((m) => m.role !== 'system');
  return [{ role: 'system', content: SYSTEM_PROMPT }, ...withoutSystem];
}

/** Stream assistant text token-by-token from the cloud LLM. */
export async function* streamChat(
  messages: ChatMessage[],
): AsyncGenerator<string> {
  const openai = getClient();
  const model = process.env.LLM_MODEL ?? DEFAULT_MODEL;

  const stream = await openai.chat.completions.create({
    model,
    messages: buildMessages(messages),
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      yield delta;
    }
  }
}
