import axios from 'axios'
import { existingUser, testAuthUser } from '../support/test-veriables'
import { LanguageType, User, UserRoleTypes } from '@market-connector/core'

describe('POST /api/auth', () => {
  it('user hasn\'t access to protected routes', async () => {
    const res = axios.get(`/users`)
    await expect(res).rejects.toHaveProperty("response.status", 401);
  })

  it('user can sign up and create account', async () => {
    const signUpRes = await axios.post<{ user: User, access_token: string }>(`/auth/signup`, testAuthUser)
    expect(signUpRes.status).toBe(201)
    expect(signUpRes.data.user.roles).toEqual([UserRoleTypes.CUSTOMER])
    expect(signUpRes.data.access_token).toEqual(expect.any(String));
    axios.defaults.headers.authorization = `Bearer ${ signUpRes.data.access_token }`;
  })

  it('user has access to protected routes after login', async () => {
    const res = await axios.get(`/users`)
    expect(res.status).toBe(200)
    expect(res.data).toBeInstanceOf(Array)
    expect(res.data[0]).toBeInstanceOf(Object)
  })

  it('user lost privilages after log out (delete jwt token)', async () => {
    axios.defaults.headers.authorization = ``;
    const res = axios.get(`/users`)
    await expect(res).rejects.toHaveProperty("response.status", 401);
  })

  it('user can login', async () => {
    const loginRes = await axios.post(`/auth/login`, { name: testAuthUser.name, password: testAuthUser.password })
    expect(loginRes.status).toBe(201)
    console.log(loginRes.data.user);
    expect(loginRes.data.user.name).toBe(testAuthUser.name)
    expect(loginRes.data.user.password).toBeUndefined()
    axios.defaults.headers.authorization = `Bearer ${ loginRes.data.access_token }`;
  })

  it('anybody can not signup using existing email', async () => {
    const res = axios.post(`/auth/signup`, {
      consents: {
        test1: true,
        test2: true,
      },
      email: testAuthUser.email,
      language: LanguageType.pl,
      name: 'anteq849012384',
      password: 'antekkoisA1',
    })
    await expect(res).rejects.toHaveProperty("response.status", 422);
  })

  it('anybody can not signup using existing name', async () => {
    const res = axios.post(`/auth/signup`, {
      consents: {
        test1: true,
        test2: true,
      },
      email: 'anteq12@gmail.com',
      language: LanguageType.pl,
      name: testAuthUser.name,
      password: 'antekkoisA2',
    })
    await expect(res).rejects.toHaveProperty("response.status", 422);
  })
})
