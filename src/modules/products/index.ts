import { UuidParamsObject } from '@/utils/type-schema';
import Elysia from 'elysia';
import { ProductsModel } from './model';
import { ProductsService } from './service';

export const productsModule = new Elysia({ prefix: '/products' })
  // GET /products
  // Récupère tous les produits
  .get('/', async () => ProductsService.getProducts())
  // POST /products
  // Crée un produit
  .post('/', async ({ body }) => ProductsService.createProduct(body), {
    body: ProductsModel.createProductsBody,
  })
  // GET /products/:id
  // Récupère un produit
  .get('/:id', async ({ params }) => ProductsService.getProduct(params.id), {
    params: UuidParamsObject,
  })
  // PATCH /products/:id
  // Modifie un produit
  .patch('/:id', async ({ params, body }) => ProductsService.modifyProduct(params.id, body), {
    params: UuidParamsObject,
    body: ProductsModel.modifyProductsBody,
  })
  // DELETE /products/:id
  // Supprime un produit
  .delete('/:id', async ({ params }) => ProductsService.deleteProduct(params.id), {
    params: UuidParamsObject,
  })
  // GET /products/:id/sales
  // Récupère les ventes d'un produit
  .get('/:id/sales', async ({ params }) => ProductsService.getProductSales(params.id), {
    params: UuidParamsObject,
  });
