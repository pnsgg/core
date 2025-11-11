import { Elysia } from 'elysia';
import { productsModule } from './modules/products';
import { seriesModule } from './modules/series';

const app = new Elysia().use(productsModule).use(seriesModule).listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
