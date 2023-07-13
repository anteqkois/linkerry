import axios from 'axios'
import { AlertProvidersType } from '@market-connector/core'

describe('POST /api/alerts', () => {
  it('should create alert', async () => {
    const input = {
      provider: AlertProvidersType.TRADING_VIEW,
      condition: undefined,
      testMode: true,
    }

    const res = await axios.post(`/alerts`, input)

    expect(res.status).toBe(201)
    // expect(res.data).toEqual({ message: 'Hello API' })
  })
})
