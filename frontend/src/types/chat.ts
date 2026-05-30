// Shared chat types: Role, ChatMessage, Message (with id)
export type ChatMessage = {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
}

export type ChatRequestBody = {
    messages: ChatMessage[]
}