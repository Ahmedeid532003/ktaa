import express from 'express';
import apiRouter from './routes.ts';
import { initStore } from './store.ts';

export async function createApp() {
  await initStore();
  const app = express();
  app.use(express.json({ limit: '5mb' }));
  app.use('/api', apiRouter);
  return app;
}
