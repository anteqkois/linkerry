import axios from 'axios'
import { login } from '../support/login'
import { AlertProvidersType, ConditionOperatorType, ConditionTypeType, IAlertInput, IAlertResponse } from '@market-connector/types'

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
    const input: IAlertInput = {
      alertProvider: AlertProvidersType.TRADING_VIEW,
      testMode: true,
      name: 'alert should pass test',
      active: true,
      alertValidityUnix: 389721,
      symbol: 'ETHUSDT'
    }

    const res = await axios.post<IAlertResponse>(`/alerts`, input)

    expect(res.data.condition).toBeDefined()
    expect(res.data.condition).toHaveProperty('_id')
    expect(res.data.condition).toHaveProperty('user')
    expect(res.data.condition).toHaveProperty('name', input.name)
    expect(res.data.condition).toHaveProperty('type', ConditionTypeType.ALERT)
    expect(res.data.condition).toHaveProperty('requiredValue', 1)
    expect(res.data.condition).toHaveProperty('operator', ConditionOperatorType.EQUAL)
    expect(res.data.condition).toHaveProperty('testMode', input.testMode)
    expect(res.data.condition).toHaveProperty('active', input.active)
    expect(res.data.condition).toHaveProperty('eventValidityUnix', input.alertValidityUnix)
    expect(res.data.condition).toHaveProperty('symbol', input.symbol)

    expect(res.data.alert).toBeDefined()
    expect(res.data.alert).toHaveProperty('_id')
    expect(res.data.alert).toHaveProperty('user')
    expect(res.data.alert).toHaveProperty('condition')
    expect(res.data.alert).toHaveProperty('name', input.name)
    expect(res.data.alert).toHaveProperty('active', input.active)
    expect(res.data.alert).toHaveProperty('messagePattern')
    expect(res.data.alert).toHaveProperty('alertHandlerUrl', `${ process.env.ALERT_HANDLER_URL }/trading-view/${ res.data.alert._id }`)
    expect(res.data.alert).toHaveProperty('alertValidityUnix', input.alertValidityUnix)
    expect(res.data.alert).toHaveProperty('alertProvider', input.alertProvider)
    expect(res.data.alert).toHaveProperty('symbol', input.symbol)
    expect(res.data.alert).toHaveProperty('testMode', input.testMode)
  })

  it('can\'t use existing alert name', async () => {
    const input: IAlertInput = {
      alertProvider: AlertProvidersType.TRADING_VIEW,
      testMode: true,
      name: 'alert should pass test',
      active: true,
      alertValidityUnix: 389721,
      symbol: 'ETHUSDT',
    }

    const res = axios.post(`/alerts`, input)
    await expect(res).rejects.toHaveProperty("response.status", 422)
  })

  it('can\'t create alert with missing data', async () => {
    const input: Partial<IAlertInput> = {
      testMode: true,
      // name: 'test alert 2',
      active: true,
      alertValidityUnix: 389721,
      symbol: 'ETHUSDT',
    }

    const res = axios.post(`/alerts`, input)
    await expect(res).rejects.toHaveProperty("response.status", 422)
  })
})
