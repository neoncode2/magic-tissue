import express from 'express';
import cors from 'cors';
import spinRoutes from './routes/spin.mjs';
import orderRoutes from './routes/orders.mjs';

export function createApp() {
  const app = express();

  app.use(cors({
    origin: true,
    credentials: false,
  }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, service: 'magic-tissue-express' });
  });

  app.use('/api/spin', spinRoutes);
  /** Same handler as Next `app/api/spin-orders` (client uses `/api/spin-orders`). */
  app.use('/api/spin-orders', orderRoutes);
  app.use('/api/orders', orderRoutes);

  app.use((error, _req, res, _next) => {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  });

  return app;
}
