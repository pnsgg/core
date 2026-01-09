import { Uuid, UuidParamsObject } from '@/utils/type-schema';
import Elysia, { t } from 'elysia';
import { SalesModel } from './model';
import { SalesService } from './service';

export const salesModule = new Elysia({ prefix: '/sales' })
  // GET /sales
  // Récupère toutes les ventes (objet partiel)
  .get('/', async () => await SalesService.getSales())
  // POST /sales
  // Crée une vente
  .post('/', async ({ body }) => await SalesService.createSale(body), {
    body: SalesModel.createSalesBody,
  })
  // GET /sales/:id
  // Récupère une vente
  .get('/:id', async ({ params }) => await SalesService.getSale(params.id), {
    params: UuidParamsObject,
  })
  // PATCH /sales/:id
  // Modifie une vente
  .patch('/:id', async ({ params, body }) => await SalesService.modifySale(params.id, body), {
    params: UuidParamsObject,
    body: SalesModel.modifySalesBody,
  })
  // DELETE /sales/:id
  // Supprime une vente et les produits vendus
  // Ne supprime pas le mouvement d'inventaire ou la transaction Firefly III
  .delete('/:id', async ({ params }) => await SalesService.deleteSale(params.id), {
    params: UuidParamsObject,
  })
  // DELETE /sales/:id/products/:index
  // Supprime un produit d'une vente
  .delete(
    '/:id/products/:index',
    async ({ params }) => await SalesService.deleteProductSale(params.id, params.index),
    {
      params: t.Object({
        id: Uuid(),
        index: t.Numeric(),
      }),
    }
  );
