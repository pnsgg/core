import { db } from '@/utils/db';
import {
  CardPaymentMethods,
  productSalesTable,
  productsTable,
  salesTable,
} from '@/utils/db/schema';
import { fireflyFetch } from '@/utils/firefly';
import { FireflyIII } from '@/utils/firefly/types';
import { and, eq, inArray } from 'drizzle-orm';
import { status } from 'elysia';
import { SalesModel } from './model';

export abstract class SalesService {
  static getSaleTotal({
    products,
  }: {
    products: {
      price: string;
      quantity: string;
    }[];
  }) {
    return products.reduce((acc, p) => acc + parseFloat(p.price) * parseFloat(p.quantity), 0);
  }

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

    const salesWithTotal = sales.map((sale) => ({
      ...sale,
      total: this.getSaleTotal(sale).toString(),
    }));

    return salesWithTotal;
  }

  static async createSale(data: SalesModel.CreateSaleBody) {
    if (data.stancerId && !CardPaymentMethods.includes(data.paymentMethod)) {
      throw status(
        400,
        `Une création de sale avec un stancerId doit avoir un paymentMethod de type : ${CardPaymentMethods.join(', ')}`
      );
    }

    const uniqueDataProductIds = new Set(data.products.map((p) => p.productId));

    if (data.products.length !== uniqueDataProductIds.size) {
      throw status(400, `Chaque objet produit doit contenir un productId unique.`);
    }

    const products = await db
      .select()
      .from(productsTable)
      .where(
        inArray(
          productsTable.id,
          data.products.map((p) => p.productId)
        )
      );

    if (products.length !== data.products.length) {
      const productsId = products.map((p) => p.id);
      const dataProductIdsNotFound = data.products
        .filter((p) => !productsId.includes(p.productId))
        .map((p) => p.productId);

      throw status(
        400,
        `Un ou plusieurs produits n'ont pas été trouvés : ${dataProductIdsNotFound.join(', ')}`
      );
    }

    const [newSale] = await db.insert(salesTable).values(data).returning();

    const newSaleProducts = await db
      .insert(productSalesTable)
      .values(
        data.products.map((product, index) => ({
          productId: product.productId,
          saleId: newSale.id,
          price: product.price,
          quantity: product.quantity,
          index,
        }))
      )
      .returning({
        price: productSalesTable.price,
        quantity: productSalesTable.quantity,
        index: productSalesTable.index,
        productId: productSalesTable.productId,
      });

    return {
      ...(({ stockMovementId, ...newSale }) => newSale)(newSale),
      products: newSaleProducts,
      total: this.getSaleTotal(data),
    };
  }

  static async getSale(saleId: string) {
    const sale = await db.query.salesTable.findFirst({
      where: ({ id }, { eq }) => eq(id, saleId),
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

    if (!sale) {
      throw status(404);
    }

    const stockMovement = sale.stockMovement
      ? {
          ...sale.stockMovement,
          fireflyData: await fireflyFetch<FireflyIII.PartialAPIGetTransactionResponse>(
            `/attachments/${sale.stockMovement.fireflyId}`
          ),
        }
      : null;

    return {
      ...sale,
      stockMovement,
      total: this.getSaleTotal(sale),
    };
  }

  static async modifySale(saleId: string, data: SalesModel.ModifySaleBody) {
    const [updatedSale] = await db
      .update(salesTable)
      .set(data)
      .where(eq(salesTable.id, saleId))
      .returning();

    if (!updatedSale) {
      throw status(404);
    }

    return updatedSale;
  }

  static async deleteSale(saleId: string) {
    const [deletedSale] = await db
      .delete(salesTable)
      .where(eq(salesTable.id, saleId))
      .returning({ id: salesTable.id });

    if (!deletedSale) {
      throw status(404);
    }

    return status(204);
  }

  static async deleteProductSale(saleId: string, productSaleIndex: number) {
    const [deletedProductSale] = await db
      .delete(productSalesTable)
      .where(
        and(eq(productSalesTable.saleId, saleId), eq(productSalesTable.index, productSaleIndex))
      )
      .returning({ id: productSalesTable.id });

    if (!deletedProductSale) {
      throw status(404);
    }

    return status(204);
  }
}
