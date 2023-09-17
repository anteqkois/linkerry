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
