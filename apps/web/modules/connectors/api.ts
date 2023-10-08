import {  Id } from '@market-connector/shared'
import { apiClient } from '../../libs/api-client'

export class ConnectorsApi {
  static async get(id: Id, query?: any) {
    return apiClient.get<IStrategy_GetOneResponse<'strategyBuy.strategyBuy'>>(`/strategies/${id}`, {
      params: query,
      paramsSerializer: {
        indexes: null, // no brackets at all
      },
    })
    // return apiClient.get<IStrategy_GetOneResponse<'strategyBuy.strategyBuy'>>(`/strategies/${id}`, {
    //   params: query,
    //   paramsSerializer: {
    //     indexes: null, // no brackets at all
    //   },
    // })
  }

  static async getAll(id: Id, query?: IStrategy_GetOneQuery) {
    return apiClient.get<IStrategy_GetOneResponse<'strategyBuy.strategyBuy'>>(`/strategies/${id}`, {
      params: query,
      paramsSerializer: {
        indexes: null, // no brackets at all
      },
    })
  }
}
