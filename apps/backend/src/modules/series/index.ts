import { db } from '@/utils/db';
import { seriesTable } from '@/utils/db/schema';
import Elysia from 'elysia';
import { SeriesModel } from './model';

export const seriesModule = new Elysia({ prefix: '/series' })
  .get(
    '/',
    async () =>
      await db.query.seriesTable.findMany({
        with: {
          events: true,
        },
      }),
  )
  .post(
    '/',
    async ({ body }) => {
      await db.insert(seriesTable).values(body);
    },
    {
      body: SeriesModel.createSeriesBody,
    },
  );
