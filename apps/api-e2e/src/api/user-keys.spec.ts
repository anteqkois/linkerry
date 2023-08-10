import { ExchangeCode, IUserKeys_CreateInput, IUserKeys_CreateResponse } from '@market-connector/types'
import axios from 'axios'
import { alwaysExistingExchange } from 'tools/models.mock'
import { login } from '../support/login'

const input: IUserKeys_CreateInput = {
  aKey: 'some_secret_binance_akey',
  sKey: 'some_secret_binance_skey',
  exchangeCode: alwaysExistingExchange.code as ExchangeCode.binance,
  exchange: alwaysExistingExchange._id,
  name: 'test keys',
}

describe('POST /api/user-keys', () => {
  it('only authenticated users can create keys', async () => {
    const res = axios.post(`/user-keys`, input)
    await expect(res).rejects.toHaveProperty('response.status', 401)
  })

  it('user can store their exchange keys', async () => {
    await login()

    const { status, data } = await axios.post<IUserKeys_CreateResponse>(`/user-keys`, input)

    expect(status).toBe(201)
    expect(data.aKeyInfo.slice(0, 4)).toBe(input.aKey.slice(0, 4))
    expect(data.sKeyInfo.slice(0, 4)).toBe(input.sKey.slice(0, 4))
    expect(data.exchange).toBe(input.exchange)
    expect(data.exchangeCode).toBe(input.exchangeCode)
    expect(data.name).toBe(input.name)
  })
})
