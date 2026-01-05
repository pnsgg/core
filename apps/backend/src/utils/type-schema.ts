import {
  NumberOptions,
  SchemaOptions,
  Static,
  StringOptions,
  TEnumValue,
  TObject,
  TOmit,
  TSchema,
  TypeGuard,
} from '@sinclair/typebox';
import { t } from 'elysia';
import { DeepPartial } from './general';

export const Uuid = (options?: StringOptions) => t.String({ ...options, format: 'uuid' });

export const FloatToString = (options?: NumberOptions) =>
  t
    .Transform(t.Numeric(options))
    .Decode((e) => e.toString())
    .Encode((e) => parseFloat(e));

export const UuidParamsObject = t.Object({
  id: Uuid(),
});

export interface TRecursiveOptional<T extends TSchema> extends TSchema {
  static: DeepPartial<Static<T>>;
}

export function RecursiveOptional<T extends TSchema>(schema: T): TRecursiveOptional<T> {
  if (TypeGuard.IsObject(schema)) {
    const newProps: Record<string, TSchema> = {};
    for (const [key, propSchema] of Object.entries(schema.properties)) {
      newProps[key] = RecursiveOptional(propSchema);
    }

    const newObj = t.Object(newProps, { ...schema });

    return t.Partial(newObj) as unknown as TRecursiveOptional<T>;
  }

  if (TypeGuard.IsArray(schema)) {
    const inner = RecursiveOptional(schema.items);
    return t.Array(inner, { ...schema }) as unknown as TRecursiveOptional<T>;
  }

  if (TypeGuard.IsUnion(schema)) {
    const anyOf = schema.anyOf.map((s: TSchema) => RecursiveOptional(s));
    return t.Union(anyOf, { ...schema }) as unknown as TRecursiveOptional<T>;
  }

  if (TypeGuard.IsIntersect(schema)) {
    const allOf = schema.allOf.map((s: TSchema) => RecursiveOptional(s));
    return t.Intersect(allOf, { ...schema }) as unknown as TRecursiveOptional<T>;
  }

  return schema as unknown as TRecursiveOptional<T>;
}

export const NoDefaultEnum = <T extends [TEnumValue, ...TEnumValue[]]>(
  values: T,
  options?: SchemaOptions,
) => t.UnionEnum(values, { default: undefined, ...options });

export function createModifySchema<T extends TObject>(schema: T): TRecursiveOptional<T>;
export function createModifySchema<T extends TObject, Keys extends (keyof Static<T>)[]>(
  schema: T,
  opts: { omit: Keys },
): TRecursiveOptional<TOmit<T, Keys>>;
export function createModifySchema<T extends TObject, Keys extends (keyof Static<T>)[]>(
  schema: T,
  opts?: { omit?: Keys },
): TRecursiveOptional<T> | TRecursiveOptional<TOmit<T, Keys>> {
  return RecursiveOptional({
    ...(opts?.omit ? t.Omit(schema, opts.omit) : schema),
    minProperties: 1,
  }) as unknown as TRecursiveOptional<T>;
}
