import { PaymentMethods } from '@/utils/db/schema';
import { createModifySchema, FloatToString, NoDefaultEnum, Uuid } from '@/utils/type-schema';
import { t } from 'elysia';

export namespace SalesModel {
  const createProductSalesBody = t.Object({
    productId: Uuid(),
    price: FloatToString({ minimum: 0 }),
    quantity: FloatToString({ minimum: 1 }),
  });

  export type CreateProductSaleBody = typeof createProductSalesBody.static;

  export const modifyProductSalesBody = createProductSalesBody;

  export type ModifyProductSaleBody = typeof modifyProductSalesBody.static;

  export const createSalesBody = t.Object({
    paymentMethod: NoDefaultEnum(PaymentMethods),
    stancerId: t.Optional(t.String()),
    eventId: Uuid(),
    // Une liste d'identifiant des produits vendus
    products: t.Array(createProductSalesBody, { minItems: 1, uniqueItems: true }),
  });

  export type CreateSaleBody = typeof createSalesBody.static;

  export const modifySalesBody = createModifySchema(createSalesBody, {
    omit: ['products', 'stancerId', 'eventId'],
  });

  export type ModifySaleBody = typeof modifySalesBody.static;
}
