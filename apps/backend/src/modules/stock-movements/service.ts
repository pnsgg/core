import { db } from '@/utils/db';
import { stockMovementsTable } from '@/utils/db/schema';
import { fireflyFetch } from '@/utils/firefly';
import { FireflyIII } from '@/utils/firefly/types';
import { eq } from 'drizzle-orm';
import { status } from 'elysia';
import { StockMovementsModel } from './model';

export abstract class StockMovementsService {
  static async getFireflyTransaction(id: string) {
    try {
      return await fireflyFetch<FireflyIII.PartialAPIGetTransactionResponse>(`/transactions/${id}`);
    } catch (error) {
      console.error(`Error fetching Firefly data for transaction ${id}:`, error);
      return null;
    }
  }

  static async getStockMovements() {
    const movements = await db.query.stockMovementsTable.findMany();

    const movementsWithFireflyData = await Promise.all(
      movements.map(async (movement) => {
        let fireflyData = null;

        if (movement.fireflyId) {
          fireflyData = await StockMovementsService.getFireflyTransaction(movement.fireflyId);
        }

        return {
          ...movement,
          fireflyData,
        };
      })
    );

    return movementsWithFireflyData;
  }

  static async createStockMovement(data: StockMovementsModel.CreateStockMovementBody) {}

  static async getStockMovement(id: string) {
    const movement = await db.query.stockMovementsTable.findFirst({
      where: eq(stockMovementsTable.id, id),
      with: {
        product: true,
        event: true,
        sales: true,
      },
    });

    if (!movement) {
      throw status(404);
    }

    let fireflyData = null;
    if (movement.fireflyId) {
      fireflyData = await StockMovementsService.getFireflyTransaction(movement.fireflyId);
    }

    return {
      ...movement,
      fireflyData,
    };
  }

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
