import { alwaysExistingUser } from '@linkerry/tools'
import axios from 'axios'

export const login = async () => {
  const res = await axios.post(`/auth/login`, { email: alwaysExistingUser.email, password: alwaysExistingUser.password })
  axios.defaults.headers.Cookie = res.headers['set-cookie'][0]
  return res.data
}
