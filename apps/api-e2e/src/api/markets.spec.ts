import { ExchangeCode, IMarket_GetQuery, IMarket_GetResponse, MarketType } from '@market-connector/types'
import axios from 'axios'
import { login } from '../support/login'

describe('POST /api/markets', () => {
  it('only authenticated users can get markets', async () => {
    const res = axios.get(`/markets`)
    await expect(res).rejects.toHaveProperty('response.status', 401)
  })

  it('can filter markets ByBit (test default query values)', async () => {
    await login()
    const params: IMarket_GetQuery = {
      exchangeCode: ExchangeCode.bybit,
      limit: 250,
    }

    const { status, data } = await axios.get<IMarket_GetResponse>(`/markets`, {
      params,
    })

    expect(status).toBe(200)
    expect(data.value).toBeDefined()
    expect(data.value.length).toEqual(params.limit)
    expect(data.hasNext).toEqual(true)
    expect(data.offset).toEqual(0)

    let rightMarketCount = 0
    data.value.forEach((m) => m.exchangeCode === ExchangeCode.bybit && m.type === MarketType.spot && rightMarketCount++)
    expect(rightMarketCount).toEqual(params.limit)
  })
})
