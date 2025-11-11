import { NumberOptions } from '@sinclair/typebox';
import { t } from 'elysia';

export const FloatToString = (options?: NumberOptions) =>
  t
    .Transform(t.Numeric(options))
    .Decode((e) => e.toString())
    .Encode((e) => parseFloat(e));

export const UuidParamsObject = t.Object({
  id: t.String({ format: 'uuid' }),
});
