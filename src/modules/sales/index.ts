import Elysia from 'elysia';
import { SalesModel } from './model';
import { SalesService } from './service';

export const salesModule = new Elysia({ prefix: '/sales' })
  .get('/', async () => await SalesService.getSales())
  .post('/', async ({ body }) => await SalesService.createSale(body), {
    body: SalesModel.createSalesBody,
  });
