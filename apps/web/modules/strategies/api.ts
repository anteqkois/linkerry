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
  IStrategy_StrategyBuyCreateInput,
  IStrategy_StrategyBuyCreateResponse,
  IStrategy_StrategyBuyDeleteResponse,
  IStrategy_StrategyBuyPatchInput,
  IStrategy_StrategyBuyPatchResponse,
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
    return apiClient.get<IStrategy_GetOneResponse<'strategyBuy.strategyBuy'>>(`/strategies/${id}`, {
      params: query,
      paramsSerializer: {
        indexes: null, // no brackets at all
      },
    })
  }

  static async create(input: IStrategy_CreateInput) {
    return apiClient.post<IStrategy_CreateResponse>(`/strategies`, input)
  }

  static async update(id: Id, input: IStrategy_UpdateInput) {
    return apiClient.put<IStrategy_UpdateResponse>(`/strategies/${id}`, input)
  }

  static async patch(id: Id, input: IStrategy_PatchInput) {
    return apiClient.patch<IStrategy_UpdateResponse>(`/strategies/${id}`, input)
  }

  static async createStrategyBuy(id: Id, input: IStrategy_StrategyBuyCreateInput) {
    return apiClient.post<IStrategy_StrategyBuyCreateResponse>(`/strategies/${id}/strategies-buy`, input)
  }

  static async patchStrategyBuy(id: Id, sId:Id, input: IStrategy_StrategyBuyPatchInput) {
    return apiClient.patch<IStrategy_StrategyBuyPatchResponse>(`/strategies/${id}/strategies-buy/${sId}`, input)
  }

  static async removeStrategyBuy(id: Id, sId:Id) {
    return apiClient.delete<IStrategy_StrategyBuyDeleteResponse>(`/strategies/${id}/strategies-buy/${sId}`)
  }
}
