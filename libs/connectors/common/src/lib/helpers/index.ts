import { ConnectorAuthProperty, OAuth2PropertyValue, Property, createAction } from '@linkerry/connectors-framework'
import { assertNotNullOrUndefined } from '@linkerry/shared'
import { HttpError, HttpHeaders, HttpMethod, HttpRequest, QueryParams, httpClient } from '../http'

export const getAccessTokenOrThrow = (auth: OAuth2PropertyValue | undefined): string => {
	const accessToken = auth?.access_token

	if (accessToken === undefined) {
		throw new Error('Invalid bearer token')
	}

	return accessToken
}

export function createCustomApiCallAction({
	auth,
	baseUrl,
	authMapping,
}: {
	auth?: ConnectorAuthProperty
	baseUrl: (auth?: unknown) => string
	authMapping?: (auth: unknown) => HttpHeaders
}) {
	return createAction({
		name: 'custom_api_call',
		displayName: 'Custom API Call',
		description: 'Send a custom API call to a specific endpoint',
		auth: auth ? auth : undefined,
		requireAuth: auth ? true : false,
		props: {
			url: Property.DynamicProperties({
				displayName: '',
				description: '',
				required: true,
				refreshers: [],
				props: async ({ auth }) => {
					return {
						url: Property.Text({
							displayName: 'URL',
							description: 'Add the endpoint to use. For example, /models',
							required: true,
							defaultValue: baseUrl(auth),
						}),
					}
				},
			}),
			method: Property.StaticDropdown({
				displayName: 'Method',
				description: '',
				required: true,
				options: {
					options: Object.values(HttpMethod).map((v) => {
						return {
							label: v,
							value: v,
						}
					}),
				},
			}),
			headers: Property.Object({
				displayName: 'Headers',
				description: 'Authorization headers are injected automatically from your connection.',
				required: true,
			}),
			queryParams: Property.Object({
				displayName: 'Query Parameters',
				description: '',
				required: true,
			}),
			body: Property.Json({
				displayName: 'Body',
				description: '',
				required: false,
			}),
			failsafe: Property.Checkbox({
				displayName: 'No Error on Failure',
				description: '',
				required: false,
			}),
			timeout: Property.Number({
				displayName: 'Timeout (in seconds)',
				description: '',
				required: false,
			}),
		},

		run: async (context) => {
			const { method, url, headers, queryParams, body, failsafe, timeout } = context.propsValue

			assertNotNullOrUndefined(method, 'Method')
			assertNotNullOrUndefined(url, 'URL')

			let headersValue = headers as HttpHeaders
			if (authMapping) {
				headersValue = {
					...headersValue,
					...authMapping(context.auth),
				}
			}

			const request: HttpRequest<Record<string, unknown>> = {
				method,
				url: url['url'],
				headers: headersValue,
				queryParams: queryParams as QueryParams,
				timeout: timeout ? timeout * 1000 : 0,
			}

			if (body) {
				request.body = body
			}

			try {
				return await httpClient.sendRequest(request)
			} catch (error) {
				if (failsafe) {
					return (error as HttpError).errorMessage()
				}
				throw error
			}
		},
	})
}
