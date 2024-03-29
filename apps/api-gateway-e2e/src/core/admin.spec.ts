import { IAuthSignUpResponse, Language, UserRole } from '@linkerry/shared'
import { testAuthUser } from '@linkerry/tools'
import axios from 'axios'

describe('POST /api/', () => {
  it("user hasn't access to protected routes", async () => {
    const res = axios.get(`/users`)
    await expect(res).rejects.toHaveProperty('response.status', 401)
  })
})
