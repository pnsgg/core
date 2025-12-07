import { productsModule } from '@/modules/products';
import { salesModule } from '@/modules/sales';
import { seriesModule } from '@/modules/series';
import { Elysia } from 'elysia';
import { eventsModule } from './modules/events';

const app = new Elysia()
  .use(eventsModule)
  .use(productsModule)
  .use(salesModule)
  .use(seriesModule)
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
