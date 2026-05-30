const suggestions = [
    "Explain quantum computing in simple terms",
    "Write a short poem about the ocean",
    "What are the best practices for React?",
    "Help me debug my code",
];

export default function EmptyState({ onSend }: { onSend: (text: string) => void }) {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-8 px-4 text-center">
            {/* Icon */}
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
            </div>

            {/* Heading */}
            <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-white">How can I help you?</h1>
                <p className="text-slate-400 text-sm">Ask me anything, I'm here to assist.</p>
            </div>

            {/* Suggestion chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {suggestions.map((s) => (
                    <button
                        key={s}
                        onClick={() => onSend(s)}
                        className="text-left px-4 py-3 rounded-xl bg-[#1e2536] border border-white/10 text-slate-300 text-sm font-medium hover:bg-[#262d42] hover:border-blue-500/50 hover:text-white transition-all duration-150"
                    >
                        {s}
                    </button>
                ))}
            </div>
        </div>
    );
}