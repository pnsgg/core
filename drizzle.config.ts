import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) {
  throw new Error("Pas de variable d'environnement DATABASE_URL trouvée. Lis le README !");
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/utils/db/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  casing: 'snake_case',
  strict: true,
  verbose: true,
});
