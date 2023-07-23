import axios from 'axios'
import { testAuthUser } from '@market-connector/tools'
import { LanguageType, User, UserRoleTypes } from '@market-connector/core'

describe('POST /api/auth', () => {
  it('user hasn\'t access to protected routes', async () => {
    const res = axios.get(`/users`)
    await expect(res).rejects.toHaveProperty("response.status", 401);
  })

  it('user can sign up and create account', async () => {
    const signUpRes = await axios.post<{ user: User }>(`/auth/signup`, testAuthUser)
    expect(signUpRes.status).toBe(201)
    expect(signUpRes.data.user.roles).toEqual([UserRoleTypes.CUSTOMER])
    axios.defaults.headers.Cookie = signUpRes.headers['set-cookie'][0];
  })

  it('user has access to protected routes after login', async () => {
    const res = await axios.get(`/users`)
    expect(res.status).toBe(200)
    expect(res.data).toBeInstanceOf(Array)
    expect(res.data[0]).toBeInstanceOf(Object)
  })

  it('user lost privilages after log out (delete jwt token)', async () => {
    delete axios.defaults.headers.Cookie
    axios.defaults.headers.authorization = ``;
    const res = axios.get(`/users`)
    await expect(res).rejects.toHaveProperty("response.status", 401);
  })

  it('user can login', async () => {
    const loginRes = await axios.post(`/auth/login`, { email: testAuthUser.email, password: testAuthUser.password })
    expect(loginRes.status).toBe(201)
    expect(loginRes.data.user.name).toBe(testAuthUser.name)
    expect(loginRes.data.user.email).toBe(testAuthUser.email)
    expect(loginRes.data.user.password).toBeUndefined()
    axios.defaults.headers.Cookie = loginRes.headers['set-cookie'][0];
  })

  it('can\'t signup using existing email', async () => {
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

  it('can\'t signup using existing name', async () => {
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
