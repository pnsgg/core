import { db } from '@/utils/db';
import { or, eq, sql } from 'drizzle-orm';
import { status } from 'elysia';
import { seriesTable } from '@/utils/db/schema';

export abstract class SeriesService {
  static async getAllSeries() {
    return await db.query.seriesTable.findMany({
      with: {
        events: {
          orderBy: ({ startsAt }, { desc }) => desc(startsAt),
        },
      },
    });
  }

  static async getSeriesByIdOrSlug(idOrSlug: string) {
    return (
      (await db.query.seriesTable.findFirst({
        where: or(eq(seriesTable.slug, idOrSlug), eq(sql`${seriesTable.id}::text`, idOrSlug)),
        with: {
          events: {
            orderBy: ({ startsAt }, { desc }) => desc(startsAt),
          },
        },
      })) || status(404)
    );
  }
}
