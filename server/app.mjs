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
    res.json({ ok: true });
  });

  app.use('/api/spin', spinRoutes);
  app.use('/api/orders', orderRoutes);

  app.use((error, _req, res, _next) => {
    res.status(500).json({ error: 'Internal server error', details: error.message });
  });

  return app;
}
