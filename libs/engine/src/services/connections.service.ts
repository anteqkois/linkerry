import {
	AppConnectionDecrypted,
	AppConnectionType,
	BasicAuthConnectionValue,
	CloudOAuth2ConnectionValue,
	CustomError,
	ErrorCode,
	OAuth2ConnectionValueWithApp,
} from '@linkerry/shared'
import { EngineConstants } from '../handler/context/engine-constants'

export const createConnectionService = ({
	// projectId,
	workerToken,
}: {
	projectId: string
	workerToken: string
}) => {
	return {
		async obtain(
			connectionName: string,
		): Promise<null | OAuth2ConnectionValueWithApp | CloudOAuth2ConnectionValue | BasicAuthConnectionValue | string | Record<string, unknown>> {
			const url = EngineConstants.API_URL + `/worker/app-connections/${encodeURIComponent(connectionName)}`
			try {
				const response = await fetch(url, {
					method: 'GET',
					headers: {
						Authorization: 'Bearer ' + workerToken,
					},
				})
				if (!response.ok) {
					throw new CustomError(`Connection information failed to load`, ErrorCode.APP_CONNECTION_NOT_FOUND, {
						url,
						response: await response.json(),
						status: await response.status,
						statusText: await response.statusText,
					})
				}
				const result: AppConnectionDecrypted | null = await response.json()
				if (result === null) {
					return null
				}

				console.dir(result, { depth: null })
				if (result.value.type === AppConnectionType.SECRET_TEXT) {
					return result.value.secret_text
				}
				if (result.value.type === AppConnectionType.CUSTOM_AUTH) {
					return result.value.props
				}
				return result.value
			} catch (error) {
				console.error(error)
				throw new CustomError(`Connection information failed to load`, ErrorCode.APP_CONNECTION_NOT_FOUND, {
					url,
					error,
				})
			}
		},
	}
}
