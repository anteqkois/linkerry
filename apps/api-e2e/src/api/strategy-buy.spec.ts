import {
  AlertProvider,
  ConditionOperator,
  ConditionType,
  IStrategyBuy_ConditionCreateInput,
  IStrategyBuy_ConditionCreateResponse,
  IStrategyBuy_ConditionPatchInput,
  IStrategyBuy_ConditionPatchResponse,
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
})

describe('POST /api/strategies-buy/:id/conditions', () => {
  let lastStrategyBuyData: IStrategyBuy_CreateResponse
  let lastConditionData: IStrategyBuy_ConditionCreateResponse

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
    lastStrategyBuyData = data
  })

  it('condition can be created and added usign strategy buy endpoint', async () => {
    const inputCondition: IStrategyBuy_ConditionCreateInput = {
      active: true,
      name: 'Added condition by strategies buy endpoint',
      type: ConditionType.Alert,
      isMarketProvider: false,
      eventValidityUnix: 8473129749023,
      operator: ConditionOperator.Crossing,
      requiredValue: 1,
      alert: {
        provider: AlertProvider.TradingView,
      },
    }

    const { status, data } = await axios.post<IStrategyBuy_ConditionCreateResponse>(
      `/strategies-buy/${lastStrategyBuyData._id}/conditions`,
      inputCondition,
    )

    expect(status).toBe(201)
    expect(data.active).toBe(inputCondition.active)
    expect(data.id).toBeDefined()
    expect(data.id).toHaveLength(24)
    expect(data.condition._id).toHaveLength(24)
    expect(data.condition.alert.provider).toBe(inputCondition.alert.provider)
    expect(data.condition.alert.handlerUrl).toBeDefined()
    expect(data.condition.isMarketProvider).toBe(false)
    expect(data.condition.name).toBe(inputCondition.name)
    expect(data.condition.operator).toBe(inputCondition.operator)
    expect(data.condition.requiredValue).toBe(inputCondition.requiredValue)
    expect(data.condition.type).toBe(inputCondition.type)
    expect(data.condition.triggeredTimes).toBe(0)
    lastConditionData = data
  })

  it('condition can be updated usign strategy buy endpoint', async () => {
    const patchInputCondition: IStrategyBuy_ConditionPatchInput = {
      active: false,
      name: 'EDITED condition by strategy buy',
      requiredValue: 2,
      operator: ConditionOperator.Equal,
      triggeredTimes: 5
    }

    const { status, data } = await axios.patch<IStrategyBuy_ConditionPatchResponse>(
      `/strategies-buy/${lastStrategyBuyData._id}/conditions/${lastConditionData.id}`,
      patchInputCondition,
    )

    expect(status).toBe(200)
    expect(data.active).toBe(patchInputCondition.active)
    expect(data.id).toHaveLength(24)
    expect(data.condition.name).toBe(patchInputCondition.name)
    expect(data.condition.requiredValue).toBe(patchInputCondition.requiredValue)
    expect(data.condition.operator).toBe(patchInputCondition.operator)
    expect(data.condition.triggeredTimes).toBe(patchInputCondition.triggeredTimes)
    lastConditionData = data
  })
})
