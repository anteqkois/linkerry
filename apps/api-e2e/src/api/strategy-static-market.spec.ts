import {
  DeepPartial,
  IStrategy_CreateInput,
  IStrategy_CreateResponse,
  IStrategy_PatchInput,
  IStrategy_PatchResponse,
  IStrategy_UpdateInput,
  IStrategy_UpdateResponse,
  StrategyState,
  StrategyType,
} from '@market-connector/types'
import axios from 'axios'
import { login } from '../support/login'
import { alwaysExistingStrategyBuyStaticMarket, alwaysExistingUser } from 'tools/models.mock'

const input: IStrategy_CreateInput = {
  type: StrategyType.StrategyStaticMarket,
  active: false,
  name: 'Strategy one',
  strategyBuy: [],
  testMode: false,
}

describe('POST /api/strategies', () => {
  let lastStrategyData: IStrategy_CreateResponse

  it('only authenticated users can create strategies', async () => {
    const res = axios.post(`/strategies`, input)
    await expect(res).rejects.toHaveProperty('response.status', 401)
  })

  it('user can create strategy', async () => {
    await login()

    const { status, data } = await axios.post<IStrategy_CreateResponse>(`/strategies`, input)

    expect(status).toBe(201)
    expect(data._id).toBeDefined()
    expect(data.triggeredTimes).toBe(0)
    expect(data.state).toBe(StrategyState.Idle)
    expect(data.triggeredTimes).toBe(0)
    expect(data.validityUnix).toBeDefined()
    expect(data.active).toBe(input.active)
    expect(data.name).toBe(input.name)
    expect(data.testMode).toBe(input.testMode)
    expect(data.type).toBe(input.type)
    expect(data.user).toBe(alwaysExistingUser._id)
    expect(data.strategyBuy).toStrictEqual([])
    lastStrategyData = data
  })

  it('user can update strategy', async () => {
    const secondInput: IStrategy_UpdateInput = {
      ...lastStrategyData,
      active: false,
      name: 'Updated strategy',
      state: StrategyState.OpenPosition,
    }

    const { status, data } = await axios.put<IStrategy_UpdateResponse>(
      `/strategies/${lastStrategyData._id}`,
      secondInput,
    )

    expect(status).toBe(200)
    expect(data._id).toBe(lastStrategyData._id)
    expect(data.state).toBe(StrategyState.OpenPosition)
    expect(data.triggeredTimes).toBe(0)
    expect(data.validityUnix).toBe(lastStrategyData.validityUnix)
    expect(data.active).toBe(secondInput.active)
    expect(data.name).toBe(secondInput.name)
    expect(data.testMode).toBe(lastStrategyData.testMode)
    expect(data.type).toBe(lastStrategyData.type)
    expect(data.user).toBe(alwaysExistingUser._id)
    expect(data.strategyBuy).toStrictEqual([])
    lastStrategyData = data
  })

  it('user can not update strategy _id', async () => {
    const secondInput: IStrategy_UpdateInput = {
      ...lastStrategyData,
      // @ts-ignore
      _id: '9381y4ufb142380h982109j',
    }

    const { status } = await axios.put<IStrategy_UpdateResponse>(
      `/strategies/${lastStrategyData._id}`,
      secondInput,
    )

    await expect(status).toBe(200)
  })

  it('user can not add strategy buy without required fields (active, etc.)', async () => {
    const patchInput: DeepPartial<IStrategy_PatchInput> = {
      ...lastStrategyData,
      strategyBuy: [
        {
          id: alwaysExistingStrategyBuyStaticMarket._id,
        },
      ],
    }

    const res = axios.patch<IStrategy_PatchResponse>(
      `/strategies/${lastStrategyData._id}`,
      patchInput,
    )
    await expect(res).rejects.toHaveProperty('response.status', 422)
  })

  it('user can add strategy buy', async () => {
    const patchInput: IStrategy_PatchInput = {
      ...lastStrategyData,
      strategyBuy: [
        {

          id: alwaysExistingStrategyBuyStaticMarket._id,
          strategyBuy: alwaysExistingStrategyBuyStaticMarket._id,
          active: true,
        },
      ],
    }

    const { status, data } = await axios.patch<IStrategy_PatchResponse>(
      `/strategies/${lastStrategyData._id}`,
      patchInput,
    )

    expect(status).toBe(200)
    expect(data._id).toBe(lastStrategyData._id)
    expect(data.state).toBe(StrategyState.OpenPosition)
    expect(data.triggeredTimes).toBe(0)
    expect(data.validityUnix).toBe(lastStrategyData.validityUnix)
    expect(data.active).toBe(patchInput.active)
    expect(data.name).toBe(patchInput.name)
    expect(data.testMode).toBe(lastStrategyData.testMode)
    expect(data.type).toBe(lastStrategyData.type)
    expect(data.user).toBe(alwaysExistingUser._id)
    expect(data.strategyBuy[0]).toMatchObject(patchInput.strategyBuy[0])
    lastStrategyData = data
  })
})
