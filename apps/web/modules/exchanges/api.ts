import {
  IExchange_GetResponse,
} from '@market-connector/types'
import { apiClient } from '../../libs/api-client'

export class ExchangesApi {
  static async get() {
    return apiClient.get<IExchange_GetResponse>('/exchanges')
  }
}
