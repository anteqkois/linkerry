import { HttpMethod, httpClient } from '@linkerry/connectors-common'
import { BASE_URL } from '.'
import { CoingeckoSearchResponse } from './types'

export const search = async (query: string): Promise<CoingeckoSearchResponse> => {
	const response = await httpClient.sendRequest<CoingeckoSearchResponse>({
		method: HttpMethod.GET,
		url: `${BASE_URL}/search`,
		queryParams: {
			query,
		},
	})

	return response.body
}
