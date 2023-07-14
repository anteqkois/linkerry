import { LanguageType, User, UserRoleTypes } from '@market-connector/core'
import axios from 'axios'
import { testUser } from '../support/test-veriables'

describe('POST /api/users', () => {
  it('can create user', async () => {
    const res = await axios.post<User>(`/users`, testUser)

    expect(res.status).toBe(201)
    expect(res.data.roles).toEqual([UserRoleTypes.CUSTOMER])
  })

  it('cannot duplicate user', async () => {
    // duplicate name
    const res = axios.post<User>(`/users`, {
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
    const secondResponse = axios.post<User>(`/users`, {
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

    const thirdResponse = await axios.post<User>(`/users`, {
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
