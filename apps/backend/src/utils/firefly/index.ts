import { env } from '.env';
import { fetch } from 'bun';

export async function fireflyFetch<T>(url: `/${string}`, init?: RequestInit) {
  return await fetch(`https://${env.FIREFLY_API_URL}/v1${url}`, {
    ...init,
    headers: {
      ...init?.headers,
      Accept: 'application/vnd.api+json',
      Authorization: `Bearer ${env.FIREFLY_TOKEN}`,
      'Content-type': 'application/json',
    },
  }).then((r) => r.json() as T);
}
