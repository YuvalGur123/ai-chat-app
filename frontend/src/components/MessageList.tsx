import type { ChatMessage } from "../types/chat";
import { useTypewriter } from "../hooks/useTypewriter";

function AssistantBubble({ content }: { content: string }) {
    const displayed = useTypewriter(content);
    return (
        <div className="max-w-[75%] px-5 py-3 rounded-2xl rounded-bl-sm text-[15px] font-medium leading-relaxed tracking-wide whitespace-pre-wrap shadow-md bg-[#1e2536] text-slate-100 border border-white/10">
            {displayed}
        </div>
    );
}

function UserBubble({ content }: { content: string }) {
    return (
        <div className="max-w-[75%] px-5 py-3 rounded-2xl rounded-br-sm text-[15px] font-medium leading-relaxed tracking-wide whitespace-pre-wrap shadow-md bg-blue-600 text-white">
            {content}
        </div>
    );
}

export default function MessageList({ messages }: { messages: ChatMessage[] }) {
    return (
        <div className="flex flex-col space-y-4">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                    {msg.role === "user"
                        ? <UserBubble content={msg.content} />
                        : <AssistantBubble content={msg.content} />
                    }
                </div>
            ))}
        </div>
    );
}