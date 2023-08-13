import {
  AlertProvider,
  ConditionOperator,
  ConditionType,
  IStrategyBuy_CreateInput,
  IStrategyBuy_CreateResponse,
  IStrategyBuy_UpdateInput,
  IStrategyBuy_UpdateResponse,
  StrategyBuyType,
} from '@market-connector/types'
import axios from 'axios'
import { alwaysExistingUser } from 'tools/models.mock'
import { login } from '../support/login'

const input: IStrategyBuy_CreateInput = {
  type: StrategyBuyType.StrategyBuyStaticMarket,
  conditions: [],
  name: 'Strategy one',
}

describe('POST /api/strategies-buy', () => {
  let lastStrategyBuyData: IStrategyBuy_CreateResponse

  it('only authenticated users can create buy strategy', async () => {
    const res = axios.post(`/strategies-buy`, input)
    await expect(res).rejects.toHaveProperty('response.status', 401)
  })

  it('user can create buy strategy', async () => {
    await login()

    const { status, data } = await axios.post<IStrategyBuy_CreateResponse>(`/strategies-buy`, input)

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
    const secondInput: IStrategyBuy_UpdateInput = {
      ...lastStrategyBuyData,
      name: 'Updated buy strategy',
      conditions: [],
      triggeredTimes: 1,
    }

    const { status, data } = await axios.put<IStrategyBuy_UpdateResponse>(
      `/strategies-buy/${lastStrategyBuyData._id}`,
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
    const secondInput: IStrategyBuy_UpdateInput = {
      ...lastStrategyBuyData,
      // @ts-ignore
      _id: '9381y4ufb142380h982109j',
    }

    const { status } = await axios.put<IStrategyBuy_UpdateResponse>(
      `/strategies-buy/${lastStrategyBuyData._id}`,
      secondInput,
    )

    expect(status).toBe(200)
  })

  it('condition is created when strategy buy input include data for creating condition', async () => {
    const inputWithCondition: IStrategyBuy_CreateInput = {
      type: StrategyBuyType.StrategyBuyStaticMarket,
      conditions: [
        {
          conditionCreateInput: {
            type: ConditionType.Alert,
            name: 'Strategy Buy create',
            operator: ConditionOperator.Equal,
            requiredValue: 1,
            eventValidityUnix: 100000,
            isMarketProvider: false,
            alert: {
              provider: AlertProvider.TradingView,
            },
          },
          active: true,
        },
      ],
      name: 'Strategy with condition to create',
    }

    const { status, data } = await axios.post<IStrategyBuy_CreateResponse>(`/strategies-buy`, inputWithCondition)

    expect(status).toBe(201)
    expect(data.conditions[0]).toBeDefined()
    expect(data.conditions).toHaveLength(1)
    expect(data.conditions[0].active).toBe(inputWithCondition.conditions[0].active)
    expect(data.conditions[0].condition).toBeDefined()
    expect(data.conditions[0].condition).toHaveLength(24)
    expect(data.conditions[0].id).toBeDefined()
    expect(data.conditions[0].id).toHaveLength(24)
  })
})
