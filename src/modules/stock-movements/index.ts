import { Elysia } from 'elysia';
import { StockMovementsModel } from './model';
import { StockMovementsService } from './service';

export const stockMovementsModule = new Elysia({ prefix: '/stock-movements' })
  // GET /stock-movements
  // Récupère tous les mouvements de stock
  .get('/', () => StockMovementsService.getStockMovements())
  // POST /stock-movements
  // Crée un nouveau mouvement de stock
  .post('/', ({ body }) => StockMovementsService.createStockMovement(body), {
    body: StockMovementsModel.createStockMovementBody,
  })
  // GET /stock-movements/:id
  // Récupère un mouvement de stock
  .get('/:id', ({ params: { id } }) => StockMovementsService.getStockMovement(id))
  // PATCH /stock-movements/:id
  // Modifie un mouvement de stock
  .patch(
    '/:id',
    ({ params: { id }, body }) => StockMovementsService.modifyStockMovement(id, body),
    {
      body: StockMovementsModel.modifyStockMovementBody,
    },
  )
  // DELETE /stock-movements/:id
  // Supprime un mouvement de stock
  .delete('/:id', ({ params: { id } }) => StockMovementsService.deleteStockMovement(id));
