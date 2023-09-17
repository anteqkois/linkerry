import axios from 'axios'
import { login } from '../support/login'

describe('POST /api/flows', () => {
  it('should create empty flow with version', async () => {
    await login()
    const res = await axios.post(`/flows`)

    console.log(res);
  })
})
