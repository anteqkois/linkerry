import {
  IStrategyBuy_StaticMarket_CreateInput
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
