import { ProductCategories, UnitsOfMeasurement } from '@/utils/db/schema';
import { createModifySchema, FloatToString, NoDefaultEnum } from '@/utils/type-schema';
import { t } from 'elysia';

export namespace ProductsModel {
  export const createProductsBody = t.Object({
    name: t.String(),
    allergens: t.Optional(t.String()),
    price: FloatToString({ exclusiveMinimum: 0.0 }),
    category: NoDefaultEnum(ProductCategories),
    quantity: FloatToString({ exclusiveMinimum: 0.0 }),
    unitOfMeasurement: NoDefaultEnum(UnitsOfMeasurement),
    isOnSale: t.Optional(t.Boolean({ default: true })),
    location: t.Optional(t.String()),
  });

  export type CreateProductBody = typeof createProductsBody.static;

  export const modifyProductsBody = createModifySchema(createProductsBody);

  export type ModifyProductBody = typeof modifyProductsBody.static;
}
