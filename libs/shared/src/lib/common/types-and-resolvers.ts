/* eslint-disable @typescript-eslint/ban-types */
export const tryParseJson = <T = unknown>(value: any): T => {
  try {
    return JSON.parse(value as string)
  } catch (e) {
    return value as T
  }
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

export const isNil = <T>(value: T | null | undefined): value is null | undefined => {
  return value === null || value === undefined
}

export const isInteger = (value: unknown) => {
  return typeof value == 'number' && value == toInteger(value)
}

export const toInteger = (value: unknown) => {
  const result = toFinite(value),
    remainder = result % 1

  return result === result ? (remainder ? result - remainder : result) : 0
}

export const toFinite = (value: unknown): number => {
  if (!value) return 0
  return Number(value)
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

export type DeepPartialArray<Thing> = Array<DeepPartial<Thing>>

export type DeepPartialObject<Thing> = {
  [Key in keyof Thing]?: DeepPartial<Thing[Key]>
}

export type Nullable<T> = T | undefined | null

export type DeepNullable<T> = {
  [P in keyof T]: T[P] | null
}

export type ValueOf<T> = Required<T>[keyof T]

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type Common<T> = Pick<T, keyof T>

export type TypeOrDefaultType<LiteralStrings, LiteralString extends string, Type, DefaultType> = LiteralString extends LiteralStrings
  ? Type
  : DefaultType
