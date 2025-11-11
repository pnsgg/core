import { productsTable } from '@/utils/db/schema';
import { FloatToString } from '@/utils/type-schema';
import { createInsertSchema, createUpdateSchema } from 'drizzle-typebox';
import { t } from 'elysia';

export namespace ProductsModel {
  export const createProductsBody = createInsertSchema(productsTable, {
    quantity: FloatToString({ exclusiveMinimum: 0.0 }),
    price: FloatToString({ exclusiveMinimum: 0.0 }),
  });

  export type CreateProductBody = typeof createProductsBody.static;

  export const updateProductsBody = createUpdateSchema(productsTable, {
    id: t.Never(),
    quantity: t.Optional(FloatToString({ exclusiveMinimum: 0.0 })),
    price: t.Optional(FloatToString({ exclusiveMinimum: 0.0 })),
  });

  export type UpdateProductBody = Omit<typeof updateProductsBody.static, 'id'>;
}
