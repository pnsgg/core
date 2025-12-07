import { treaty } from '@elysiajs/eden';
import type { App } from 'backend';

export const pnrestClient = treaty<App>('localhost:3000');
