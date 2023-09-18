import axios from 'axios'
import { login } from '../support/login'
import { alwaysExistingUser } from 'tools/models.mock'
import { FlowStatus } from '@market-connector/shared'

describe('POST /api/flows', () => {
  it('should create empty flow with version', async () => {
    await login()
    const res = await axios.post(`/flows`)

    expect(res.data.user).toBe(alwaysExistingUser._id)
    expect(res.data.status).toBe(FlowStatus.Unpublished)
    expect(res.data.version).toBeInstanceOf(Object)
  })
})
