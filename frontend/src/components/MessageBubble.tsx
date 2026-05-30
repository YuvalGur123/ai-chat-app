// Single message bubble — user vs assistant styling
import type { ChatMessage } from "../types/chat";

type Props = {
    message: ChatMessage;
};

export default function MessageBubble({ message }: Props) {
    const isUser = message.role === "user";

    return (
        <div
            className={`flex w-full mb-3 ${isUser ? "justify-end" : "justify-start"
                }`}
        >
            <div
                className={`
          max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          whitespace-pre-wrap
          ${isUser
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-900 rounded-bl-sm"
                    }
        `}
            >
                {message.content}
            </div>
        </div>
    );
}