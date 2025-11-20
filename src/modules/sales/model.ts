import { PaymentMethods } from '@/utils/db/schema';
import { FloatToString, Uuid } from '@/utils/type-schema';
import { t } from 'elysia';

export namespace SalesModel {
  const createProductSalesBody = t.Object({
    productId: Uuid(),
    price: FloatToString({ minimum: 0 }),
    quantity: FloatToString({ minimum: 1 }),
  });

  export const createSalesBody = t.Object({
    paymentMethod: t.UnionEnum(PaymentMethods),
    stancerId: t.Optional(t.String()),
    eventId: Uuid(),
    // Une liste d'identifiant des produits vendus
    products: t.Array(createProductSalesBody, { minItems: 1, uniqueItems: true }),
  });

  export type CreateSaleBody = typeof createSalesBody.static;
}
