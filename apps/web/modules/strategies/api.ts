import {
  IStrategyBuy_StaticMarket_CreateInput, IStrategy_StaticMarket_CreateInput, IStrategy_StaticMarket_CreateResponse
} from '@market-connector/types'
import { apiClient } from '../../libs/api-client'

export class StrategyBuyApi {
  static async createStatic(input: IStrategyBuy_StaticMarket_CreateInput) {
    return apiClient.post<IStrategyBuy_StaticMarket_CreateInput>(
      '/strategies-buy/static',
      input,
    )
  }
}

export class StrategyApi {
  static async createStatic(input: IStrategy_StaticMarket_CreateInput) {
    return apiClient.post<IStrategy_StaticMarket_CreateResponse>(
      '/strategies/static',
      input,
    )
  }
}
