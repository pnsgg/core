import { Elysia } from 'elysia';
import { authenticationModule } from './modules/authentication';
import { seriesModule } from './modules/series';

const app = new Elysia().use(seriesModule).use(authenticationModule).listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
