import { HttpMethod, httpClient } from '@linkerry/connectors-common'
import { GetCoinResponse, PingResponse } from '../types/coin'
import { GetTrendingsResponse } from '../types/trending'
import { CoingeckoSearchResponse } from './types'

export const BASE_URL = 'https://api.coingecko.com/api/v3'

export const CoingeckoApi = {
  getCoins: () => {
    return null
  },
  ping: ({ auth }: { auth: string }) => {
    return httpClient.sendRequest<PingResponse>({
      method: HttpMethod.GET,
      url: `${BASE_URL}/ping`,
      headers: {
        'x-cg-demo-api-key': auth,
      },
    })
  },
  getCoin: async ({ auth, coinId }: { auth: string; coinId: string }) => {
    return httpClient.sendRequest<GetCoinResponse>({
      method: HttpMethod.GET,
      url: `${BASE_URL}/coins/${coinId}`,
      headers: {
        'x-cg-demo-api-key': auth,
      },
    })
  },
  getTrendings: async ({ auth }: { auth: string }) => {
    return httpClient.sendRequest<GetTrendingsResponse>({
      method: HttpMethod.GET,
      url: `${BASE_URL}/search/trending`,
      headers: {
        'x-cg-demo-api-key': auth,
      },
    })
  },
  search: async ({ auth, query }: { auth: string; query: string }) => {
    return httpClient.sendRequest<CoingeckoSearchResponse>({
      method: HttpMethod.GET,
      url: `${BASE_URL}/search`,
      queryParams: {
        query,
      },
      headers: {
        'x-cg-demo-api-key': auth,
      },
    })
  },
  getGlobalInfo: async ({ auth }: { auth: string }) => {
    return httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${BASE_URL}/global`,
      headers: {
        'x-cg-demo-api-key': auth,
      },
    })
  },
  getDeFiInfo: async ({ auth }: { auth: string }) => {
    return httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `${BASE_URL}/decentralized_finance_defi`,
      headers: {
        'x-cg-demo-api-key': auth,
      },
    })
  },
}
