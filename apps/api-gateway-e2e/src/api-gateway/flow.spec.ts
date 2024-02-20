import { FlowStatus } from '@linkerry/shared'
import axios from 'axios'
import { alwaysExistingUser } from 'tools/db/models.mock'
import { login } from '../support/login'

describe('POST /api/flows', () => {
  it('should create empty flow with version', async () => {
    await login()
    const res = await axios.post(`/flows`)

    expect(res.data.user).toBe(alwaysExistingUser._id)
    expect(res.data.status).toBe(FlowStatus.Unpublished)
    expect(res.data.version).toBeInstanceOf(Object)
  })
})
