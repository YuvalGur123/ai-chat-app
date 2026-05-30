/** Who sent the message — matches OpenAI chat roles. */
export type Role = 'user' | 'assistant' | 'system';

/** One message in a conversation, as sent to or from the API. */
export interface ChatMessage {
  role: Role;
  content: string;
}

/** JSON body for POST /api/chat */
export interface ChatRequestBody {
  messages: ChatMessage[];
}
