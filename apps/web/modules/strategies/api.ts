import {
  IStrategyBuy_StaticMarket_CreateInput,
  IStrategyBuy_StaticMarket_CreateResponse,
  IStrategyBuy_StaticMarket_UpdateInput,
  IStrategyBuy_StaticMarket_UpdateResponse,
  IStrategy_CreateInput,
  IStrategy_CreateResponse,
  IStrategy_GetOneQuery,
  IStrategy_GetOneResponse,
  IStrategy_PatchInput,
  IStrategy_PatchResponse,
  IStrategy_UpdateInput,
  IStrategy_UpdateResponse,
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

  static async create(input: IStrategy_CreateInput) {
    return apiClient.post<IStrategy_CreateResponse>(`/strategies`, input)
  }

  static async update(id: Id, input: IStrategy_UpdateInput) {
    return apiClient.put<IStrategy_UpdateResponse>(`/strategies/${id}`, input)
  }

  static async patch(id: Id, input: IStrategy_PatchInput) {
    return apiClient.patch<IStrategy_PatchResponse>(`/strategies/${id}`, input)
  }
}
