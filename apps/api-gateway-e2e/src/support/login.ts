import axios from 'axios'
import { alwaysExistingUser } from '@market-connector/tools'

export const login = async () => {
  const res = await axios.post(`/auth/login`, { email: alwaysExistingUser.email, password: alwaysExistingUser.password })
  axios.defaults.headers.Cookie = res.headers['set-cookie'][0]
  return res.data
}
