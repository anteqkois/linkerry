import { HttpMethod, httpClient } from '@linkerry/connectors-common'
import { GetCoinResponse } from '../types/coin'
import { GetTrendingsResponse } from '../types/trending'
import { CoingeckoSearchResponse } from './types'
export const BASE_URL = 'https://api.coingecko.com/api/v3'

export const CoingeckoApi = {
	getCoins: () => {
		return null
	},
	getCoin: async (coinId: string) => {
		return httpClient.sendRequest<GetCoinResponse>({
			method: HttpMethod.GET,
			url: `${BASE_URL}/coins/${coinId}`,
		})
	},
	getTrendings: async () => {
		return httpClient.sendRequest<GetTrendingsResponse>({
			method: HttpMethod.GET,
			url: `${BASE_URL}/search/trending`,
		})
	},
	search: async (query: string) => {
		return httpClient.sendRequest<CoingeckoSearchResponse>({
			method: HttpMethod.GET,
			url: `${BASE_URL}/search`,
			queryParams: {
				query,
			},
		})
	},
}