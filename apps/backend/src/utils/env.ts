import { cleanEnv, str, url } from 'envalid';

export const env = cleanEnv(Bun.env, {
  DATABASE_URL: url({
    desc: 'Une URL vers une base de données PostgreSQL',
    example: 'postgres://postgres@db:5432/pns',
  }),
  FIREFLY_TOKEN: str({
    desc: "Un jeton d'accès personnel à ton instance Firefly III",
    docs: 'https://docs.firefly-iii.org/how-to/firefly-iii/features/api/#personal-access-tokens',
  }),
  FIREFLY_API_URL: url({
    desc: "L'URL racine de ton instance Firefly III",
    example: 'https://firefly.pns.gg/api',
  }),
});
