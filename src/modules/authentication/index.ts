import Elysia from 'elysia';
import { AuthenticationModel } from './model';
import { AuthenticationService } from './service';

export const authenticationModule = new Elysia({ prefix: '/authentication' })
  // POST /authentication/register
  // Créer un nouvel utilisateur
  .post('/register', async ({ body }) => AuthenticationService.createUser(body), {
    body: AuthenticationModel.createUsersBody,
  })
  // DELETE /authentication/delete
  .delete('/delete', async ({ body }) => AuthenticationService.deleteUser(body), {
    body: AuthenticationModel.deleteUsersBody,
  });
