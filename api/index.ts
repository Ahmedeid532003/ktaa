import 'dotenv/config';
import type { Express, Request, Response } from 'express';
import { createApp } from '../server/app.ts';

let appPromise: Promise<Express> | null = null;

function getApp() {
  if (!appPromise) appPromise = createApp();
  return appPromise;
}

export default async function handler(req: Request, res: Response) {
  const app = await getApp();
  return app(req, res);
}
