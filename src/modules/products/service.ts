import { db } from '@/utils/db';
import { productsTable } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';
import { status } from 'elysia';
import { ProductsModel } from './model';

export abstract class ProductsService {
  static async getProducts() {
    return await db.query.productsTable.findMany();
  }

  static async getProduct(productId: string) {
    const product = await db.query.productsTable.findFirst({
      where: (product, { eq }) => eq(product.id, productId),
    });

    if (!product) {
      throw status(404);
    }

    return product;
  }

  static async createProduct(data: ProductsModel.CreateProductBody) {
    const [newProduct] = await db.insert(productsTable).values(data).returning();

    return status(201, newProduct);
  }

  static async modifyProduct(productId: string, data: ProductsModel.UpdateProductBody) {
    const [updatedProduct] = await db
      .update(productsTable)
      .set(data)
      .where(eq(productsTable.id, productId))
      .returning();

    if (!updatedProduct) {
      throw status(404);
    }

    return updatedProduct;
  }

  static async deleteProduct(productId: string) {
    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, productId))
      .returning({ id: productsTable.id });

    if (!deletedProduct) {
      throw status(404);
    }

    return status(204);
  }
}
