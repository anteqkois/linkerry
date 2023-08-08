import { AlertProvider, ConditionOperator, ConditionType, IAlert_CreateInput, ICondition_CreateResponse } from '@market-connector/types'
import axios from 'axios'
import { login } from '../support/login'

describe('POST /api/conditions', () => {
  it('only authenticated users can create conditions', async () => {
    const input: Partial<IAlert_CreateInput> = {
      testMode: true,
      // name: 'test alert 2',
      active: true,
      eventValidityUnix: 389721,
    }

    const res = axios.post(`/conditions`, input)
    await expect(res).rejects.toHaveProperty("response.status", 401)
  })

  it('can create condition - alert - Trading View', async () => {
    await login()
    const input: IAlert_CreateInput = {
      active: true,
      name: 'Test 1',
      eventValidityUnix: 389721,
      isMarketProvider: false,
      operator: ConditionOperator.Crossing,
      requiredValue: 1,
      testMode: true,
      type: ConditionType.Alert,
      alert:{
        provider: AlertProvider.TradingView
      }
    }

    const res = await axios.post<ICondition_CreateResponse>(`/conditions`, input)

    expect(res.status).toBe(201)
    expect(res.data.condition).toBeDefined()
    expect(res.data.condition).toHaveProperty('_id')
    expect(res.data.condition).toHaveProperty('user')
    expect(res.data.condition).toHaveProperty('active', input.active)
    expect(res.data.condition).toHaveProperty('name', input.name)
    expect(res.data.condition).toHaveProperty('eventValidityUnix', input.eventValidityUnix)
    expect(res.data.condition).toHaveProperty('isMarketProvider', input.isMarketProvider)
    expect(res.data.condition).toHaveProperty('operator', input.operator)
    expect(res.data.condition).toHaveProperty('requiredValue', input.requiredValue)
    expect(res.data.condition).toHaveProperty('testMode', input.testMode)
    expect(res.data.condition).toHaveProperty('type', input.type)
    expect(res.data.condition.alert.provider).toBe(input.alert.provider)
    expect(res.data.condition.alert.handlerUrl).toBeDefined()
    expect(res.data.condition.triggeredTimes).toBe(0)
  })

  it('can\'t use existing condition name', async () => {
    const input: IAlert_CreateInput = {
      active: true,
      name: 'Test 1',
      eventValidityUnix: 389721,
      isMarketProvider: false,
      operator: ConditionOperator.Crossing,
      requiredValue: 1,
      testMode: true,
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
      testMode: true,
      // name: 'test alert 2',
      active: true,
      requiredValue: 2
    }

    const res = axios.post(`/conditions`, input)
    await expect(res).rejects.toHaveProperty("response.status", 422)
  })
})
