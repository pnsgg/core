import { drizzle } from 'drizzle-orm/bun-sql';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error("Pas de variable d'environnement DATABASE_URL trouvée. Lis le README !");
}

export const db = drizzle(process.env.DATABASE_URL, {
  schema,
  casing: 'snake_case',
});
