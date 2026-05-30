export default function ChatInput({
    value,
    onChange,
    onSend,
    loading,
}: {
    value: string;
    onChange: (v: string) => void;
    onSend: () => void;
    loading: boolean;
}) {
    return (
        <div className="flex gap-2">
            <input
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSend()}
                placeholder="Type a message..."
            />

            <button
                onClick={onSend}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-xl text-sm"
            >
                Send
            </button>
        </div>
    );
}
