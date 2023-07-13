import { CreateCustomerDto, LanguageType } from '@market-connector/core'
import axios from 'axios'

describe('POST /api/customers', () => {
  it('can create customer', async () => {
    const input: CreateCustomerDto = {
      consents: {
        test1: true,
        test2: true,
      },
      email: 'anteq@gmail.com',
      language: LanguageType.pl,
      name: 'anteq',
      password: 'antekkoisA',
    }

    const res = await axios.post(`/customers`, input)

    expect(res.status).toBe(201)
    // expect(res.data).toEqual({ message: 'Hello API' })
  })
})
