import { CreateCustomerDto, Customer, CustomerRoleTypes, LanguageType } from '@market-connector/core'
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

    const res = await axios.post<Customer>(`/customers`, input)

    expect(res.status).toBe(201)
    expect(res.data.roles).toEqual([CustomerRoleTypes.CUSTOMER])
  })

  it('cannot duplicate customer', async () => {
    // duplicate name
    const res = axios.post<Customer>(`/customers`, {
      consents: {
        test1: true,
        test2: true,
      },
      email: 'anteq1@gmail.com',
      language: LanguageType.pl,
      name: 'anteq',
      password: 'antekkoisA1',
    })
    expect(res).rejects.toHaveProperty("response.status", 422);

    // duplicate email
    const secondResponse = axios.post<Customer>(`/customers`, {
      consents: {
        test1: true,
        test2: true,
      },
      email: 'anteq@gmail.com',
      language: LanguageType.pl,
      name: 'anteq213',
      password: 'antekkoisA2',
    })
    expect(secondResponse).rejects.toHaveProperty("response.status", 422);

    const thirdResponse = await axios.post<Customer>(`/customers`, {
      consents: {
        test1: true,
        test2: true,
      },
      email: 'anteq1@gmail.com',
      language: LanguageType.pl,
      name: 'anteq1',
      password: 'antekkoisA3',
    })
    expect(thirdResponse.status).toBe(201)
  })
})
