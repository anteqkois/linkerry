import axios from 'axios'
import { redirect } from 'next/navigation'
// import { useRouter } from 'next/router';
// import { store } from '../../features/common/store';
// import fingerprint from '../../utils/fingerprint'

export const API_URL = process.env.NEXT_PUBLIC_API_HOST

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
				await redirect('/login')
			} catch (e) {
				await  redirect('/login')
			}
		}
		throw error
	},
)

export { apiClient }
