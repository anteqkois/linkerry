import { AlertProvidersType } from '@market-connector/core'
import axios from 'axios'
import { login } from '../support/login'

describe('POST /api/alerts', () => {
  it('only authenticated users can create alert', async () => {
    const input = {
      provider: AlertProvidersType.TRADING_VIEW,
      condition: undefined,
      testMode: true,
    }

    const res = axios.post(`/alerts`, input)

    await expect(res).rejects.toHaveProperty("response.status", 401)
  })

  it('can create alert', async () => {
    await login()
    const input = {
      alertProvider: AlertProvidersType.TRADING_VIEW,
      testMode: true,
      // name: 'test',
      active: true,
      alertValidityUnix: 389721,
      ticker: 'BTC'
    }
      const res = await axios.post(`/alerts`, input)
     // expect(res.status).toBe(201)
    // expect(res.data).toEqual({ message: 'Hello API' })
  })
})
