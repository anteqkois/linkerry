import { AuthStatus, Cookies } from '@linkerry/shared'
import axios from 'axios'
// import { useRouter } from 'next/router';
// import { store } from '../../features/common/store';
// import fingerprint from '../../utils/fingerprint'

export const redirectToLogin = () => {
  window.location.href = `/login?from=${window.location.pathname}`
}

// const clearAuthCookies = () => {
//   document.cookie = `${Cookies.ACCESS_TOKEN}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
//   document.cookie = `${Cookies.AUTH_STATUS}=${AuthStatus.UNAUTHENTICATED}; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
// }

export const API_URL = process.env.NEXT_PUBLIC_API_HOST ?? 'https://api.linkerry.com'

const apiClient = axios.create({
  withCredentials: true,
  baseURL: `${API_URL}/api/v1`,
})

apiClient.interceptors.request.use(async (config) => {
  // config.headers.fingerprint = await fingerprint
  return config
})

apiClient.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    const originalRequest = error.config

    if (error?.response?.status == 401 && error?.config && !error?.config?._isRetry) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get<{ success: boolean }>(`${API_URL}/api/v1/auth/refresh`, {
          withCredentials: true,
          headers: {
            // fingerprint: await fingerprint,
          },
        })
        if (response.data.success) return apiClient.request(originalRequest)
        // Move user to login page, tell that session expired
        // clearAuthCookies()
        await redirectToLogin()
      } catch (e) {
        // clearAuthCookies()
        await redirectToLogin()
      }
    }
    throw error
  },
)

export { apiClient }
