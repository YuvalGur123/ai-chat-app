// useChat hook — messages state, sendMessage, stop, clearChat
import { useState } from "react";
import type { ChatMessage } from "../types/chat";
import { streamChat } from "../api/chatClient";

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [loading, setLoading] = useState(false);

    async function send(text: string) {
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
        };

        const assistantId = crypto.randomUUID();

        // Capture clean history (no empty placeholders) before updating state
        const history = messages.filter((m) => m.content.trim() !== "");

        setMessages((prev) => [
            ...prev.filter((m) => m.content.trim() !== ""),
            userMessage,
            { id: assistantId, role: "assistant", content: "" },
        ]);

        setLoading(true);

        await streamChat(
            [...history, userMessage],
            (token) => {
                setMessages((prev) =>
                    prev.map((m) =>
                        m.id === assistantId
                            ? { ...m, content: m.content + token }
                            : m
                    )
                );
            },
            () => setLoading(false),
            (err) => {
                console.error(err);
                setLoading(false);
            }
        );
    }

    return { messages, sendMessage: send, loading };
}