import axios from 'axios'
import { realUser } from '../support/test-veriables'

describe('POST /api/auth', () => {
  it('user hasn\'t access to protected routes', async () => {
    const res = axios.get(`/users`)
    expect(res).rejects.toHaveProperty("response.status", 401);
  })

  it('user can login', async () => {
    const res = await axios.post(`/auth/login`, { name: realUser.name, password: realUser.password })
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
