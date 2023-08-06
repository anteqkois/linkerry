import {
  IExchangeResponse,
} from '@market-connector/types'
import { apiClient } from '../../libs/api-client'

export class ExchangesApi {
  static async get() {
    return apiClient.get<IExchangeResponse>('/exchanges')
  }
}
