export type Id = string

export type ProjectId = Id

export function isNil<T>(value: T | null | undefined): value is null | undefined {
  return value === null || value === undefined;
}

export function isString(str: unknown): str is string {
  return str != null && typeof str === "string";
}

export function isEmpty<T>(value: T | null | undefined): boolean {
  if (value == null) {
    return true;
  }

  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return false;
}
