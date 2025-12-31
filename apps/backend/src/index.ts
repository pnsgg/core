import { Elysia } from 'elysia';
import { eventsModule } from './modules/events';
import { seriesModule } from './modules/series';

const app = new Elysia()
  .use(seriesModule)
  .use(eventsModule)
  .listen({ port: 3000, hostname: '0.0.0.0' });

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
