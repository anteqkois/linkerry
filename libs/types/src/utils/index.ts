export enum Cookies {
  AUTH_STATUS = 'auth-status',
  ACCESS_TOKEN = 'access_token',
}

export type Dictionary<K extends string | number | symbol, V> = {
  [key in K]: V
}
