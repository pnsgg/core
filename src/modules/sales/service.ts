import { db } from '@/utils/db';
import {
  CardPaymentMethods,
  productSalesTable,
  productsTable,
  salesTable,
} from '@/utils/db/schema';
import { fireflyFetch } from '@/utils/firefly';
import { FireflyIII } from '@/utils/firefly/types';
import { inArray } from 'drizzle-orm';
import { status } from 'elysia';
import { SalesModel } from './model';

export abstract class SalesService {
  static async getSales() {
    const sales = await db.query.salesTable.findMany({
      columns: {
        stockMovementId: false,
      },
      with: {
        products: {
          columns: {
            id: false,
            saleId: false,
          },
        },
        stockMovement: true,
      },
    });

    const salesWithFData = await Promise.all(
      sales.map(async (sale) => ({
        ...sale,
        stockMovement: sale.stockMovement
          ? {
              ...sale.stockMovement,
              fireflyData: await fireflyFetch<FireflyIII.PartialAPIGetTransactionResponse>(
                `/attachments/${sale.stockMovement.fireflyId}`,
              ),
            }
          : null,
      })),
    );

    return salesWithFData;
  }

  static async createSale(data: SalesModel.CreateSaleBody) {
    if (data.stancerId && !CardPaymentMethods.includes(data.paymentMethod)) {
      throw status(
        400,
        `Une création de sale avec un stancerId doit avoir un paymentMethod de type : ${CardPaymentMethods.join(', ')}`,
      );
    }

    const products = await db
      .select()
      .from(productsTable)
      .where(
        inArray(
          productsTable.id,
          data.products.map((p) => p.productId),
        ),
      );

    if (products.length !== data.products.length) {
      const productsId = products.map((p) => p.id);
      const dataProductIdsNotFound = data.products
        .filter((p) => !productsId.includes(p.productId))
        .map((p) => p.productId);

      throw status(
        400,
        `Un ou plusieurs produits n'ont pas été trouvés : ${dataProductIdsNotFound.join(', ')}`,
      );
    }

    const [newSale] = await db.insert(salesTable).values(data).returning({ id: productsTable.id });

    return await db
      .insert(productSalesTable)
      .values(
        data.products.map((product) => ({
          productId: product.productId,
          saleId: newSale.id,
          price: product.price,
          quantity: product.quantity,
        })),
      )
      .returning();
  }
}
