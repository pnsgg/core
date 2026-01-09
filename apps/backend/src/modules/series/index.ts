import { db } from '@/utils/db';
import { seriesTable } from '@/utils/db/schema';
import Elysia, { t } from 'elysia';
import { SeriesModel } from './model';
import { SeriesService } from './service';

export const seriesModule = new Elysia({ prefix: '/series' })
  .get('/', async () => SeriesService.getAllSeries())
  .get('/:idOrSlug', async ({ params }) => SeriesService.getSeriesByIdOrSlug(params.idOrSlug), {
    params: t.Object({
      idOrSlug: t.String(),
    }),
  })
  .post(
    '/',
    async ({ body }) => {
      await db.insert(seriesTable).values(body);
    },
    {
      body: SeriesModel.createSeriesBody,
    }
  );
