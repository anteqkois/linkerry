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
  value: R
  offset: number
}

export type Id = string // Id to db docuemnt

export interface DbTimestamp {
  createdAt?: Date
  updatedAt?: Date
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
