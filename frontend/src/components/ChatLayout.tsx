import { useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";
import { useChat } from "../hooks/useChat";

export default function ChatLayout() {
    const { messages, sendMessage, loading } = useChat();
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;
        await sendMessage(input);
        setInput("");
    };

    const handleSuggestion = (text: string) => {
        sendMessage(text);
    };

    return (
        <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.length === 0 ? (
                    <EmptyState onSend={handleSuggestion} />
                ) : (
                    <>
                        <MessageList messages={messages} />
                        {loading && (
                            <div className="text-sm text-slate-500 animate-pulse pl-1">
                                Assistant is typing...
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="border-t border-white/10 p-4">
                <ChatInput
                    value={input}
                    onChange={setInput}
                    onSend={handleSend}
                    loading={loading}
                />
            </div>
        </div>
    );
}