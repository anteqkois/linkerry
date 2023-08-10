export const removeUndefinedKeys = <T>(obj: T): Partial<T> => {
  const result: Partial<T> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && typeof obj[key] !== 'undefined') {
      result[key] = obj[key]
    }
  }
  return result
}
