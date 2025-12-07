import { UserRoles } from '@/utils/db/schema';
import { t } from 'elysia';

export namespace AuthenticationModel {
  export const createUsersBody = t.Object({
    name: t.String({
      minLength: 1,
    }),
    role: t.UnionEnum(UserRoles, {
      default: undefined,
    }),
  });

  export type CreateUserBody = typeof createUsersBody.static;

  export const findUsersByNameBody = t.Object({
    name: t.String({ minLength: 1 }),
  });

  export type FindUserByNameBody = typeof findUsersByNameBody.static;

  export const deleteUsersBody = t.Object({
    id: t.String({ format: 'uuid' }),
  });

  export type DeleteUserBody = typeof deleteUsersBody.static;
}
