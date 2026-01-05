import { StockMovementTypes } from '@/utils/db/schema';
import { createModifySchema, FloatToString, NoDefaultEnum, Uuid } from '@/utils/type-schema';
import { t } from 'elysia';

export namespace StockMovementsModel {
  export const createStockMovementBody = t.Object({
    productId: Uuid(),
    quantity: FloatToString(),
    price: FloatToString({ minimum: 0 }),
    type: NoDefaultEnum(StockMovementTypes),
    fireflyId: t.Optional(t.String()),
    eventId: t.Optional(Uuid()),
    salesIds: t.Optional(t.Array(Uuid())),
  });

  export type CreateStockMovementBody = typeof createStockMovementBody.static;

  export const modifyStockMovementBody = createModifySchema(createStockMovementBody, {
    omit: ['salesIds'],
  });

  export type ModifyStockMovementBody = typeof modifyStockMovementBody.static;
}
