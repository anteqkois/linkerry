import { Alert, AlertProvidersType, Condition } from '@market-connector/core'
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
      name: 'test alert',
      active: true,
      alertValidityUnix: 389721,
      ticker: 'BTC'
    }

    const res = await axios.post(`/alerts`, input)
    expect(res.data.condition).toBeDefined()
    expect(res.data.alert).toBeDefined()
  })

  it('can\'t use existing alert name', async () => {
    const input = {
      alertProvider: AlertProvidersType.TRADING_VIEW,
      testMode: true,
      name: 'test alert',
      active: true,
      alertValidityUnix: 389721,
      ticker: 'BTC'
    }

    const res = axios.post(`/alerts`, input)
    await expect(res).rejects.toHaveProperty("response.status", 422)
  })
})
