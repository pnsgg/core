import { treaty } from '@elysiajs/eden';
import type { App } from 'backend';

const API_URL =
  process.env.NODE_ENV === 'production' ? 'http://backend:3000' : 'http://localhost:3000';

export const pnsClient = treaty<App>(API_URL);
