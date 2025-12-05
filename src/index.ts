import { Elysia } from 'elysia';
import { authenticationModule } from './modules/authentication';
import { eventsModule } from './modules/events';
import { seriesModule } from './modules/series';

const app = new Elysia().use(authenticationModule).use(seriesModule).use(eventsModule).listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
