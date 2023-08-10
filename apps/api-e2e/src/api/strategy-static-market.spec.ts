import {
  IStrategy_StaticMarket_CreateInput,
  IStrategy_StaticMarket_CreateResponse,
  IStrategy_StaticMarket_UpdateInput,
  IStrategy_StaticMarket_UpdateResponse,
  StrategyType,
} from '@market-connector/types'
import axios from 'axios'
import { login } from '../support/login'

const input: IStrategy_StaticMarket_CreateInput = {
  type: StrategyType.StrategyStaticMarket,
  active: false,
  name: 'Strategy one',
  strategyBuy: [],
  testMode: false,
}

describe('POST /api/strategies/static-market', () => {
  let createdStrategy: IStrategy_StaticMarket_CreateResponse

  it('only authenticated users can create strategies', async () => {
    const res = axios.post(`/strategies/static-market`, input)
    await expect(res).rejects.toHaveProperty('response.status', 401)
  })

  it('user can create strategy', async () => {
    await login()

    const { status, data } = await axios.post<IStrategy_StaticMarket_CreateResponse>(`/strategies/static-market`, input)

    expect(status).toBe(201)
    expect(data._id).toBeDefined()
    expect(data.triggeredTimes).toBe(0)
    expect(data.validityUnix).toBeDefined()
    expect(data.active).toBe(input.active)
    expect(data.name).toBe(input.name)
    expect(data.testMode).toBe(input.testMode)
    expect(data.type).toBe(input.type)
    expect(data.strategyBuy).toStrictEqual([])
    createdStrategy = data
  })

  it('user can update strategy', async () => {
    const secondInput: IStrategy_StaticMarket_UpdateInput = {
      ...createdStrategy,
      active: false,
      name: 'Updated strategy',
    }
    
    const { status, data } = await axios.put<IStrategy_StaticMarket_UpdateResponse>(
      `/strategies/static-market/${createdStrategy._id}`,
      secondInput,
    )

    expect(status).toBe(200)
    expect(data.active).toBe(secondInput.active)
    expect(data.name).toBe(secondInput.name)
    expect(data.testMode).toBe(secondInput.testMode)
    expect(data.type).toBe(secondInput.type)
    expect(data.strategyBuy).toStrictEqual([])
  })

  it('user can not update strategy _id', async () => {
    const secondInput: IStrategy_StaticMarket_UpdateInput = {
      ...createdStrategy,
      _id: '9381y4ufb142380h982109j',
    }

    const { status } = await axios.put<IStrategy_StaticMarket_UpdateResponse>(
      `/strategies/static-market/${createdStrategy._id}`,
      secondInput,
    )

    await expect(status).toBe(200)
  })
})
