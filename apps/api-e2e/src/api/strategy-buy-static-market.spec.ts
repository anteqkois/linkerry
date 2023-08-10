import {
  IStrategyBuy_StaticMarket_CreateInput,
  IStrategyBuy_StaticMarket_CreateResponse,
  IStrategyBuy_StaticMarket_UpdateInput,
  IStrategyBuy_StaticMarket_UpdateResponse,
  IStrategy_StaticMarket_CreateInput,
  IStrategy_StaticMarket_CreateResponse,
  IStrategy_StaticMarket_UpdateInput,
  IStrategy_StaticMarket_UpdateResponse,
  StrategyBuyType,
  StrategyType,
} from '@market-connector/types'
import axios from 'axios'
import { login } from '../support/login'
import { alwaysExistingUser } from 'tools/models.mock'

const input: IStrategyBuy_StaticMarket_CreateInput = {
  type:StrategyBuyType.StrategyBuyStaticMarket,
  conditions:[],
  name: 'Strategy one',
}

describe('POST /api/strategies-buy/static-market', () => {
  let lastStrategyBuyData: IStrategyBuy_StaticMarket_CreateResponse

  it('only authenticated users can create buy strategy', async () => {
    const res = axios.post(`/strategies-buy/static-market`, input)
    await expect(res).rejects.toHaveProperty('response.status', 401)
  })

  it('user can create buy strategy', async () => {
    await login()

    const { status, data } = await axios.post<IStrategyBuy_StaticMarket_CreateResponse>(`/strategies-buy/static-market`, input)

    expect(status).toBe(201)
    expect(data._id).toBeDefined()
    expect(data.triggeredTimes).toBe(0)
    expect(data.validityUnix).toBeDefined()
    expect(data.name).toBe(input.name)
    expect(data.type).toBe(input.type)
    expect(data.user).toBe(alwaysExistingUser._id)
    expect(data.conditions).toStrictEqual([])
    lastStrategyBuyData = data
  })

  it('user can update buy strategy', async () => {
    const secondInput: IStrategyBuy_StaticMarket_UpdateInput = {
      ...lastStrategyBuyData,
      name: 'Updated buy strategy',
      conditions: [],
      triggeredTimes: 1
    }

    const { status, data } = await axios.put<IStrategyBuy_StaticMarket_UpdateResponse>(
      `/strategies-buy/static-market/${lastStrategyBuyData._id}`,
      secondInput,
    )

    expect(status).toBe(200)
    expect(data._id).toBe(lastStrategyBuyData._id)
    expect(data.triggeredTimes).toBe(1)
    expect(data.validityUnix).toBe(lastStrategyBuyData.validityUnix)
    expect(data.name).toBe(secondInput.name)
    expect(data.type).toBe(secondInput.type)
    expect(data.user).toBe(alwaysExistingUser._id)
    expect(data.conditions).toStrictEqual([])
    lastStrategyBuyData = data
  })

  it('user can not update buy strategy _id', async () => {
    const secondInput: IStrategyBuy_StaticMarket_UpdateInput = {
      ...lastStrategyBuyData,
      _id: '9381y4ufb142380h982109j',
    }

    const { status } = await axios.put<IStrategy_StaticMarket_UpdateResponse>(
      `/strategies-buy/static-market/${lastStrategyBuyData._id}`,
      secondInput,
    )

    await expect(status).toBe(200)
  })
})
