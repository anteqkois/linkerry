import axios from 'axios'
import { authUser } from '../support/test-veriables'

describe('POST /api/auth', () => {
  it('user hasn\'t access to protected routes', async () => {
    const res = axios.get(`/users`)
    expect(res).rejects.toHaveProperty("response.status", 401);

    // Create user for perform operations
    await axios.post(`/users`, authUser)
  })

  it('user can login', async () => {
    const res = await axios.post(`/auth/login`, { name: authUser.name, password: authUser.password })
    expect(res.status).toBe(201)
    axios.defaults.headers.authorization = `Bearer ${ res.data.access_token }`;
  })

  it('user has access to protected routes after login', async () => {
    const res = await axios.get(`/users`)
    expect(res.status).toBe(200)
    expect(res.data).toBeInstanceOf(Array)
    expect(res.data[0]).toBeInstanceOf(Object)
  })
})
