import cors from '@fastify/cors';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import { registerChatRoutes } from './routes/chat.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3001;
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN ?? 'http://localhost:5173';

async function main() {
  const app = Fastify({ logger: true, bodyLimit: 102_400 });

  await app.register(cors, {
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'OPTIONS'],
  });

  app.get('/api/health', async () => ({ ok: true }));

  await registerChatRoutes(app);

  await app.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`Backend listening on http://localhost:${PORT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
