/* eslint-disable @typescript-eslint/ban-types */
export function isNil<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined
}

export function isString(str: unknown): str is string {
  return str != null && typeof str === 'string'
}

export function isEmpty<T>(value: T | null | undefined): boolean {
  if (value == null) {
    return true
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}

export type Dictionary<K extends string | number | symbol, V> = {
  [key in K]: V
}

export type DeepPartial<Thing> = Thing extends Function
  ? Thing
  : Thing extends Array<infer InferredArrayMember>
  ? DeepPartialArray<InferredArrayMember>
  : Thing extends object
  ? DeepPartialObject<Thing>
  : Thing | undefined

export interface DeepPartialArray<Thing> extends Array<DeepPartial<Thing>> {}

export type DeepPartialObject<Thing> = {
  [Key in keyof Thing]?: DeepPartial<Thing[Key]>
}

export type Nullable<T> = T | undefined | null;

export type DeepNullable<T> = {
  [P in keyof T]: T[P] | null;
};

export type ValueOf<T> = Required<T>[keyof T];

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}
