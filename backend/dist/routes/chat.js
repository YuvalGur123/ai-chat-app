import { streamChat } from '../services/llm.js';
const VALID_ROLES = new Set([
    'user',
    'assistant',
    'system',
]);
function validateMessages(messages) {
    if (!Array.isArray(messages)) {
        return { ok: false, error: 'messages must be an array' };
    }
    if (messages.length === 0) {
        return { ok: false, error: 'messages must not be empty' };
    }
    if (messages.length > 100) {
        return { ok: false, error: 'too many messages' };
    }
    const parsed = [];
    for (const item of messages) {
        if (typeof item !== 'object' ||
            item === null ||
            !('role' in item) ||
            !('content' in item)) {
            return { ok: false, error: 'invalid message shape' };
        }
        const { role, content } = item;
        if (!VALID_ROLES.has(role)) {
            return { ok: false, error: `invalid role: ${role}` };
        }
        if (typeof content !== 'string' || content.trim() === '') {
            return { ok: false, error: 'message content must be a non-empty string' };
        }
        if (content.length > 32_000) {
            return { ok: false, error: 'message content too long' };
        }
        parsed.push({ role, content: content.trim() });
    }
    const last = parsed[parsed.length - 1];
    if (last.role !== 'user') {
        return { ok: false, error: 'last message must be from the user' };
    }
    return { ok: true, messages: parsed };
}
export async function registerChatRoutes(app) {
    app.post('/api/chat', (request, reply) => {
        const validated = validateMessages(request.body?.messages);
        if (!validated.ok) {
            return reply.status(400).send({ error: validated.error });
        }
        const res = reply.raw;
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': request.headers.origin ?? '*',
        });
        (async () => {
            try {
                for await (const delta of streamChat(validated.messages)) {
                    res.write(`event: token\ndata: ${JSON.stringify({ delta })}\n\n`);
                }
                res.write(`event: done\ndata: {}\n\n`);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to generate response';
                res.write(`event: error\ndata: ${JSON.stringify({ message })}\n\n`);
            }
            finally {
                res.end();
            }
        })();
        return new Promise(() => { });
    });
}
