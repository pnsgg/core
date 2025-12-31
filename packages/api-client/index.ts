import { treaty } from '@elysiajs/eden';
import type { App } from 'backend';

export const pnsClient = treaty<App>('backend:3000');
