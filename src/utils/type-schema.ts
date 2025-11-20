import { NumberOptions, StringOptions } from '@sinclair/typebox';
import { t } from 'elysia';

export const Uuid = (options?: StringOptions) => t.String({ ...options, format: 'uuid' });

export const FloatToString = (options?: NumberOptions) =>
  t
    .Transform(t.Numeric(options))
    .Decode((e) => e.toString())
    .Encode((e) => parseFloat(e));

export const UuidParamsObject = t.Object({
  id: Uuid(),
});
