export type Dictionary<K extends string | number | symbol, V> = {
  [key in K]: V
}
export interface IPaginationQuery {
  offset?: number
  limit?: number
}

export interface IPaginationResponse {
  offset?: number
}

export interface IResourceResponse<R> {
  hasNext: boolean
  data: R
  offset: number
  count: number
}

export type Id = string // Id to db docuemnt

export interface DbTimestamp {
  createdAt?: Date
  updatedAt?: Date
}
