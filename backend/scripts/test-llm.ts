/**
 * One-off test: calls Groq via streamChat() and prints the reply.
 * Run from backend/: npx tsx scripts/test-llm.ts
 */
import dotenv from 'dotenv';
import { streamChat } from '../src/services/llm.js';

dotenv.config();

const messages = [
  {
    role: 'user' as const,
    content: 'Reply with exactly: Groq test OK',
  },
];

console.log('Sending test message to Groq...\n');

try {
  for await (const delta of streamChat(messages)) {
    process.stdout.write(delta);
  }
  console.log('\n\nDone — Groq connection works.');
} catch (err) {
  console.error(
    '\nFailed:',
    err instanceof Error ? err.message : err,
  );
  process.exit(1);
}
