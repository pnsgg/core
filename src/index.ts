import openapi, { fromTypes } from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { seriesModule } from './modules/series';

export const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: 'PNReST documentation',
          description: 'REST API used by PNS softwares',
          version: '0.0.0',
        },
      },
      references: fromTypes(
        process.env.NODE_ENV === 'production' ? 'dist/index.d.ts' : 'src/index.ts',
      ),
    }),
  )
  .use(seriesModule)
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
