import { HttpMethod, httpClient } from '@market-connector/connectors-common'
import { GetCoinResponse } from '../types/coin'
import { GetTrendingsResponse } from '../types/trending'
export const BASE_URL = 'https://api.coingecko.com/api/v3'

export const coingeckoApi = {
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
}
