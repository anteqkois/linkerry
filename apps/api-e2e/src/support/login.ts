import axios from 'axios'
import { alwaysExistingUser } from '@market-connector/tools'

export const login = async () => {
  const res = await axios.post(`/auth/login`, { name: alwaysExistingUser.name, password: alwaysExistingUser.password })
  axios.defaults.headers.Cookie = res.headers['set-cookie'][0]
  return res.data
}
