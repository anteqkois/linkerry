import axios from 'axios'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
// import { useRouter } from 'next/router';
// import { store } from '../../features/common/store';
// import fingerprint from '../../utils/fingerprint'

export const API_URL = 'https://api.linkerry.com'

const apiServerClient = axios.create({
  withCredentials: true,
  baseURL: `${API_URL}/api/v1`,
})

apiServerClient.interceptors.request.use(async (config) => {
  // Pass client cookies on server to axios instance
  cookies().getAll()
  let cookieString = ''
  cookies()
    .getAll()
    .forEach((cookie) => {
      cookieString += `${cookie.name}=${cookie.value}; `
    })
  config.headers.Cookie = cookieString
  // config.headers.fingerprint = await fingerprint
  return config
})

apiServerClient.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get<{ success: boolean }>(`${API_URL}/api/v1/auth/refresh`, {
          withCredentials: true,
          headers: {
            // fingerprint: await fingerprint,
          },
        })
        if (response.data.success) return apiServerClient.request(originalRequest)
        // Move user to login page, tell that session expired
        await redirect('/login')
      } catch (error) {
        console.error({ e: error })
        await redirect('/login')
      }
    }
    throw error
  },
)

export { apiServerClient }
