import { seriesTable } from '@/utils/db/schema';
import { createInsertSchema } from 'drizzle-typebox';

export namespace SeriesModel {
  export const createSeriesBody = createInsertSchema(seriesTable);
}
