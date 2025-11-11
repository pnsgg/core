import { env } from '.env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/utils/db/schema.ts',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  casing: 'snake_case',
  strict: true,
  verbose: true,
});
