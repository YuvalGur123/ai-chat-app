# AI Chat App

React frontend + Node backend.

## Structure

```
backend/src/
  index.ts          # Server bootstrap
  routes/chat.ts    # POST /api/chat
  services/llm.ts   # OpenAI streaming
  types/chat.ts

frontend/src/
  api/chatClient.ts
  hooks/useChat.ts
  components/       # ChatLayout, MessageList, MessageBubble, ChatInput
  types/chat.ts
```

## Setup

<!-- TODO: backend + frontend install and run instructions -->
