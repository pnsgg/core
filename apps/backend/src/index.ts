import { productsModule } from '@/modules/products';
import { salesModule } from '@/modules/sales';
import { seriesModule } from '@/modules/series';
import { stockMovementsModule } from '@/modules/stock-movements';
import { Elysia } from 'elysia';
import { eventsModule } from './modules/events';

const app = new Elysia()
  .use(eventsModule)
  .use(productsModule)
  .use(salesModule)
  .use(seriesModule)
  .use(stockMovementsModule)
  .listen({ port: 3000, hostname: '0.0.0.0' });

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;
