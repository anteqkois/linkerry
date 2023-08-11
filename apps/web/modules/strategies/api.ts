import {
  IStrategyBuy_StaticMarket_CreateInput,
  IStrategy_GetOneQuery,
  IStrategy_GetOneResponse,
  IStrategy_StaticMarket_CreateInput,
  IStrategy_StaticMarket_CreateResponse,
  IStrategy_StaticMarket_UpdateInput,
  IStrategy_StaticMarket_UpdateResponse,
  Id,
} from '@market-connector/types'
import { apiClient } from '../../libs/api-client'

export class StrategyBuyApi {
  static async createStatic(input: IStrategyBuy_StaticMarket_CreateInput) {
    return apiClient.post<IStrategyBuy_StaticMarket_CreateInput>('/strategies-buy/static-market', input)
  }
}

export class StrategyApi {
  static async get(id: Id, query?: IStrategy_GetOneQuery) {
    return apiClient.get<IStrategy_GetOneResponse>(`/strategies/${id}`, { params: query })
  }

  // Static Market
  static async createStatic(input: IStrategy_StaticMarket_CreateInput) {
    return apiClient.post<IStrategy_StaticMarket_CreateResponse>('/strategies/static-market', input)
  }

  static async updateStatic(input: IStrategy_StaticMarket_UpdateInput) {
    return apiClient.put<IStrategy_StaticMarket_UpdateResponse>('/strategies/static-market', input)
  }
}
