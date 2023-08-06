import axios from 'axios'
// import { useRouter } from 'next/router';
// import { store } from '../../features/common/store';
// import fingerprint from '../../utils/fingerprint'

export const API_URL = process.env.NEXT_PUBLIC_API_URL

const apiClient = axios.create({
  withCredentials: true,
  baseURL: `${API_URL}/api`,
})

apiClient.interceptors.request.use(async (config) => {
  // config.headers.Authorization = `Bearer ${Cookies.get('token-access')}`
  // config.headers.fingerprint = await fingerprint
  return config
})

apiClient.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get<{ success: boolean }>(`${API_URL}/api/auth/refresh`, {
          withCredentials: true,
          headers: {
            // fingerprint: await fingerprint,
          },
        })
        if (response.data.success) return apiClient.request(originalRequest)
        // Move user to login page, tell that session expired
      } catch (e) {
        console.log({ e })
      }
    }
    throw error
  },
)

export { apiClient }
