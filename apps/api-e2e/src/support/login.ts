import axios from "axios";
import { existingUser } from "./test-veriables"

export const login = async () => {
  const res = await axios.post(`/auth/login`, { name: existingUser.name, password: existingUser.password })
  axios.defaults.headers.authorization = `Bearer ${ res.data.access_token }`;
  return res.data
}
