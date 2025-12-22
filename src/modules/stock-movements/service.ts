import { db } from '@/utils/db';
import { stockMovementsTable } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';
import { status } from 'elysia';
import { StockMovementsModel } from './model';

export abstract class StockMovementsService {
  static async getStockMovements() {
    return [];
  }

  static async createStockMovement(data: StockMovementsModel.CreateStockMovementBody) {}

  static async getStockMovement(id: string) {}

  static async modifyStockMovement(id: string, data: StockMovementsModel.ModifyStockMovementBody) {
    const [updatedMovement] = await db
      .update(stockMovementsTable)
      .set(data)
      .where(eq(stockMovementsTable.id, id))
      .returning();

    if (!updatedMovement) {
      throw status(404);
    }

    return updatedMovement;
  }

  static async deleteStockMovement(id: string) {
    const [deletedMovement] = await db
      .delete(stockMovementsTable)
      .where(eq(stockMovementsTable.id, id))
      .returning({ id: stockMovementsTable.id });

    if (!deletedMovement) {
      throw status(404);
    }

    return status(204);
  }
}
