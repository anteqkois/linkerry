import { BASE_URL } from '.'
import { CoingeckoSearchResponse } from './types'

export const search = async (search: string): Promise<CoingeckoSearchResponse> => {
  const response = await fetch(
    `${BASE_URL}/search?${new URLSearchParams({
      search,
    })}`,
    {
      method: 'GET',
    },
  )
  return await response.json()
}
