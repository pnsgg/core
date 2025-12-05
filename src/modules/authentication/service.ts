import { db } from '@/utils/db';
import { usersTable } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';
import { status } from 'elysia';
import { AuthenticationModel } from './model';

export abstract class AuthenticationService {
  static async findUserByName(data: AuthenticationModel.FindUserByNameBody) {
    return db.query.usersTable.findFirst({
      where: eq(usersTable.name, data.name),
    });
  }

  static async createUser(data: AuthenticationModel.CreateUserBody) {
    const existingUser = await AuthenticationService.findUserByName(data);
    if (existingUser) {
      throw status(409, 'Un utilisateur avec ce nom existe déjà.');
    }

    const [createdUser] = await db.insert(usersTable).values(data).returning();

    return status(201, createdUser);
  }

  static async deleteUser(data: AuthenticationModel.DeleteUserBody) {
    const [deletedUser] = await db.delete(usersTable).where(eq(usersTable.id, data.id)).returning({
      id: usersTable.id,
    });

    if (!deletedUser) {
      throw status(404);
    }

    return status(204);
  }
}
