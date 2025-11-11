import { cleanEnv, url } from 'envalid';

export const env = cleanEnv(Bun.env, {
  DATABASE_URL: url({
    desc: 'Une URL vers une base de données PostgreSQL',
    example: 'postgres://postgres@db:5432/pns',
  }),
});
