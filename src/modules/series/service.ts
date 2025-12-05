import { db } from '@/utils/db';
import { seriesTable } from '@/utils/db/schema';
import { eq } from 'drizzle-orm';

export abstract class SeriesService {
  static async getSeries(id: string) {
    return await db.query.seriesTable.findFirst({
      where: eq(seriesTable.id, id),
    });
  }
}
