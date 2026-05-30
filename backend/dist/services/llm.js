import OpenAI from 'openai';
const SYSTEM_PROMPT = 'You are a helpful assistant in a chat app. Be concise and clear.';
const DEFAULT_BASE_URL = 'https://api.groq.com/openai/v1';
const DEFAULT_MODEL = 'llama-3.1-8b-instant';
let client = null;
function getApiKey() {
    const key = process.env.LLM_API_KEY ?? process.env.GROQ_API_KEY;
    if (!key) {
        throw new Error('LLM_API_KEY is not set. Create a free key at https://console.groq.com and add it to backend/.env');
    }
    return key;
}
function getClient() {
    if (!client) {
        client = new OpenAI({
            baseURL: process.env.LLM_BASE_URL ?? DEFAULT_BASE_URL,
            apiKey: getApiKey(),
        });
    }
    return client;
}
export function buildMessages(messages) {
    const withoutSystem = messages.filter((m) => m.role !== 'system');
    return [{ role: 'system', content: SYSTEM_PROMPT }, ...withoutSystem];
}
export async function* streamChat(messages) {
    const openai = getClient();
    const model = process.env.LLM_MODEL ?? DEFAULT_MODEL;
    const stream = await openai.chat.completions.create({
        model,
        messages: buildMessages(messages),
        stream: true,
    });
    for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
            yield delta;
        }
    }
}
