import { AlertProvider, ConditionOperator, ConditionType, IAlert_CreateInput, ICondition_CreateResponse } from '@market-connector/types'
import axios from 'axios'
import { login } from '../support/login'

describe('POST /api/conditions', () => {
  it('only authenticated users can create conditions', async () => {
    const input: Partial<IAlert_CreateInput> = {
      // name: 'test alert 2',
      eventValidityUnix: 389721,
    }

    const res = axios.post(`/conditions`, input)
    await expect(res).rejects.toHaveProperty("response.status", 401)
  })

  it('can create condition - alert - Trading View', async () => {
    await login()
    const input: IAlert_CreateInput = {
      name: 'Test 1',
      eventValidityUnix: 389721,
      isMarketProvider: false,
      operator: ConditionOperator.Crossing,
      requiredValue: 1,
      type: ConditionType.Alert,
      alert:{
        provider: AlertProvider.TradingView
      }
    }

    const res = await axios.post<ICondition_CreateResponse>(`/conditions`, input)

    expect(res.status).toBe(201)
    expect(res.data).toBeDefined()
    expect(res.data).toHaveProperty('_id')
    expect(res.data).toHaveProperty('user')
    expect(res.data).toHaveProperty('name', input.name)
    expect(res.data).toHaveProperty('eventValidityUnix', input.eventValidityUnix)
    expect(res.data).toHaveProperty('isMarketProvider', input.isMarketProvider)
    expect(res.data).toHaveProperty('operator', input.operator)
    expect(res.data).toHaveProperty('requiredValue', input.requiredValue)
    expect(res.data).toHaveProperty('type', input.type)
    expect(res.data.alert.provider).toBe(input.alert.provider)
    expect(res.data.alert.handlerUrl).toBeDefined()
    expect(res.data.triggeredTimes).toBe(0)
  })

  it('can\'t use existing condition name', async () => {
    const input: IAlert_CreateInput = {
      name: 'Test 1',
      eventValidityUnix: 389721,
      isMarketProvider: false,
      operator: ConditionOperator.Crossing,
      requiredValue: 1,
      type: ConditionType.Alert,
      alert:{
        provider: AlertProvider.TradingView
      }
    }

    const res = axios.post(`/conditions`, input)
    await expect(res).rejects.toHaveProperty("response.status", 422)
  })

  it('can\'t create alert with missing data', async () => {
    const input: Partial<IAlert_CreateInput> = {
      // name: 'test alert 2',
      requiredValue: 2
    }

    const res = axios.post(`/conditions`, input)
    await expect(res).rejects.toHaveProperty("response.status", 422)
  })
})
