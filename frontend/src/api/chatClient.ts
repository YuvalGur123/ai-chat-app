import type { ChatMessage } from "../types/chat";

/** Strip the frontend-only `id` field before sending to the backend. */
function toApiMessages(messages: ChatMessage[]) {
    return messages.map(({ role, content }) => ({ role, content }));
}

export async function streamChat(
    messages: ChatMessage[],
    onToken: (token: string) => void,
    onDone: () => void,
    onError: (err: any) => void
) {
    try {
        const res = await fetch("http://localhost:3001/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: toApiMessages(messages) }),
        });

        if (!res.body) throw new Error("No response body");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        let buffer = "";
        let isDone = false;

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // split SSE messages
            const events = buffer.split("\n\n");
            buffer = events.pop() || "";

            for (const event of events) {
                const lines = event.split("\n");

                let eventType = "";
                let data = "";

                for (const line of lines) {
                    if (line.startsWith("event:")) {
                        eventType = line.replace("event:", "").trim();
                    } else if (line.startsWith("data:")) {
                        // overwrite, don't accumulate — each SSE event has one data line
                        data = line.replace("data:", "").trim();
                    }
                }

                if (!data) continue;

                if (eventType === "token") {
                    try {
                        const parsed = JSON.parse(data);
                        onToken(parsed.delta);
                    } catch {
                        onToken(data);
                    }
                }

                if (eventType === "done") {
                    isDone = true;
                    onDone();
                }

                if (eventType === "error") {
                    onError(data);
                }
            }
        }

        // Only call onDone if the SSE "done" event was never received
        if (!isDone) {
            onDone();
        }
    } catch (err) {
        onError(err);
    }
}
