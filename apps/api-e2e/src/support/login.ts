import axios from "axios";
import { alwaysExistingUser } from "@market-connector/tools";

export const login = async () => {
  const res = await axios.post(`/auth/login`, { name: alwaysExistingUser.name, password: alwaysExistingUser.password })
  axios.defaults.headers.authorization = `Bearer ${ res.data.access_token }`;
  return res.data
}
