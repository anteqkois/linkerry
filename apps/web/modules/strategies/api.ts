import {
  IStrategyBuy_StaticMarket_CreateInput,
  IStrategyBuy_StaticMarket_CreateResponse,
  IStrategyBuy_StaticMarket_UpdateInput,
  IStrategyBuy_StaticMarket_UpdateResponse,
  IStrategy_GetOneQuery,
  IStrategy_GetOneResponse,
  IStrategy_PatchInput,
  IStrategy_PatchResponse,
  IStrategy_StaticMarket_CreateInput,
  IStrategy_StaticMarket_CreateResponse,
  IStrategy_StaticMarket_PatchInput,
  IStrategy_StaticMarket_UpdateInput,
  IStrategy_StaticMarket_UpdateResponse,
  Id,
} from '@market-connector/types'
import { apiClient } from '../../libs/api-client'

export class StrategyBuyApi {
  static async createStatic(input: IStrategyBuy_StaticMarket_CreateInput) {
    return apiClient.post<IStrategyBuy_StaticMarket_CreateResponse>('/strategies-buy/static-market', input)
  }

  static async update(id: Id, input: IStrategyBuy_StaticMarket_UpdateInput) {
    return apiClient.put<IStrategyBuy_StaticMarket_UpdateResponse>(`/strategies-buy/${id}`, input)
  }
}

export class StrategyApi {
  static async get(id: Id, query?: IStrategy_GetOneQuery) {
    return apiClient.get<IStrategy_GetOneResponse>(`/strategies/${id}`, { params: query })
  }

  static async patch(id: Id, input: IStrategy_PatchInput) {
    return apiClient.get<IStrategy_PatchResponse>(`/strategies/${id}`, { data: input })
  }

  // Static Market
  static async createStatic(input: IStrategy_StaticMarket_CreateInput) {
    return apiClient.post<IStrategy_StaticMarket_CreateResponse>('/strategies/static-market', input)
  }

  static async updateStatic(input: IStrategy_StaticMarket_UpdateInput) {
    return apiClient.put<IStrategy_StaticMarket_UpdateResponse>('/strategies/static-market', input)
  }
}
