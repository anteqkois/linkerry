import { ConnectorMetadata, OAuth2Property } from '@linkerry/connectors-framework'
import {
	AppConnectionType,
	AppConnectionWithoutSensitiveData,
	CustomError,
	ErrorCode,
	assertNotNullOrUndefined,
	isCustomHttpExceptionAxios,
} from '@linkerry/shared'
import {
	ButtonClient,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	useToast,
} from '@linkerry/ui-components/client'
import { Button } from '@linkerry/ui-components/server'
import dayjs from 'dayjs'
import { nanoid } from 'nanoid'
import { Dispatch, FormEvent, HTMLAttributes, SetStateAction, useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useClientQuery } from '../../../libs/react-query'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { MarkdownBase } from '../../../shared/components/Markdown/MarkdownBase'
import { Spinner } from '../../../shared/components/Spinner'
import { AppConnectionsApi } from '../../app-connections'
import { OAuth2AppsQueryConfig } from '../../app-connections/query-configs-apps'

export interface OAuth2AuthProps extends HTMLAttributes<HTMLElement> {
	onCreateAppConnection: (newConnection: AppConnectionWithoutSensitiveData) => void
	auth: OAuth2Property<any>
	connector: Pick<ConnectorMetadata, 'displayName' | 'name'>
	setShowDialog: Dispatch<SetStateAction<boolean>>
}

export const OAuth2Auth = ({ onCreateAppConnection, auth, connector, setShowDialog }: OAuth2AuthProps) => {
	const { data, status } = useClientQuery(OAuth2AppsQueryConfig.getManyApps())
	const [OAuth2Settings, setOAuth2Settings] = useState<OAuth2Settings | null>(null)
	const [OAuth2Response, setOAuth2Response] = useState<OAuth2Response | null>(null)

	useEffect(() => {
		if (status !== 'success') return
		const app = data.find((app) => app.connectorName === connector.name)
		assertNotNullOrUndefined(app, 'app')

		setOAuth2Settings({
			auth_url: auth.authUrl,
			redirect_url: `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/oauth2/redirect`,
			scope: auth.scope.join(' '),
			pkce: auth.pkce ?? false,
			extraParams: auth.extra || {},
			client_id: app.clientId,
		})
	}, [status])

	/* form */
	const { toast } = useToast()
	const [loading, setLoading] = useState(false)
	const appConnectionForm = useForm<{ name: string } & Record<string, any>>({
		mode: 'all',
		defaultValues: {
			name: `${connector.name.replace('@linkerry/', '').toLocaleLowerCase()}-${dayjs().unix()}`,
		},
	})

	/* OAuth2 modal window */
	const [currentOpenedWindow, setCurrentOpenedWindow] = useState<Window | null>()
	const constructRedirectUrl = useCallback(
		(pckeChallenge: string) => {
			assertNotNullOrUndefined(OAuth2Settings, 'oAoth2Settings')

			const queryParams: Record<string, string> = {
				response_type: 'code',
				client_id: OAuth2Settings.client_id,
				redirect_uri: OAuth2Settings.redirect_url,
				access_type: 'offline',
				state: nanoid(),
				prompt: 'consent',
				scope: OAuth2Settings.scope,
				...OAuth2Settings.extraParams,
			}

			if (OAuth2Settings.pkce) {
				const code_challenge = pckeChallenge
				queryParams['code_challenge_method'] = 'plain'
				queryParams['code_challenge'] = code_challenge
			}

			const url = new URL(OAuth2Settings.auth_url)

			Object.entries(queryParams).forEach(([key, value]) => {
				url.searchParams.append(key, value)
			})

			return url.toString()
		},
		[OAuth2Settings],
	)

	const openWindow = (url: string): Window | null => {
		const windowFeatures =
			'resizable=no, toolbar=no,left=100, top=100, scrollbars=no, menubar=no, status=no, directories=no, location=no, width=600, height=800'
		return window.open(url, '_blank', windowFeatures)
	}

	const observeWindowForResponse = (redirectUrl: string, pkce: boolean | undefined, pckeChallenge: string | undefined, popup: Window | null) => {
		window.addEventListener('message', function handler(event) {
			if (redirectUrl && redirectUrl.startsWith(event.origin) && event.data['code']) {
				event.data.code = decodeURIComponent(event.data.code)
				popup?.close()
				window.removeEventListener('message', handler)

				if (event.data != undefined && event.data.code != undefined) {
					return setOAuth2Response({
						status: 'succees',
						code: event.data.code,
						code_challenge: pkce ? pckeChallenge : undefined,
					})
				}
				console.error('Empty event data or code', event)
				setOAuth2Response({
					status: 'error',
					errorMessage: 'Can not retrive required data',
				})
			}
		})
	}

	const onConnectOAuth2 = () => {
		currentOpenedWindow?.close()

		assertNotNullOrUndefined(OAuth2Settings, 'oAoth2Settings')
		const pckeChallenge = nanoid()
		const redirectUrl = constructRedirectUrl(pckeChallenge)
		const newWidnow = openWindow(redirectUrl)
		setCurrentOpenedWindow(window)
		observeWindowForResponse(OAuth2Settings.redirect_url, OAuth2Settings?.pkce, pckeChallenge, newWidnow)
	}

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!appConnectionForm.formState.isValid) return
		setLoading(true)
		appConnectionForm.clearErrors()

		const { name } = appConnectionForm.getValues()

		try {
			assertNotNullOrUndefined(OAuth2Settings, 'OAuth2Settings')
			assertNotNullOrUndefined(OAuth2Response, 'OAuth2Response')
			assertNotNullOrUndefined(auth.authorizationMethod, 'auth.authorizationMethod')

			if (OAuth2Response.status === 'error') throw new CustomError('Can not process when OAuth2 response status is error', ErrorCode.INVALID_TYPE)

			const { data } = await AppConnectionsApi.upsert({
				connectorName: connector.name,
				name,
				type: AppConnectionType.CLOUD_OAUTH2,
				value: {
					type: AppConnectionType.CLOUD_OAUTH2,
					authorization_method: auth.authorizationMethod,
					client_id: OAuth2Settings.client_id,
					code: OAuth2Response.code,
					scope: OAuth2Settings.scope,
					code_challenge: OAuth2Response.code_challenge,
					// TODO implment props
					// props?: Record<string, string>
				},
			})

			toast({
				title: `Connection ${data.name} was succesfully saved`,
				description: 'You can now use this connection through all of your flows.',
				variant: 'success',
			})

			onCreateAppConnection(data)
			setShowDialog(false)
		} catch (error: any) {
			if (isCustomHttpExceptionAxios(error))
				appConnectionForm.setError('root', {
					message: error.response.data.message,
				})
			else {
				console.error(error)
				appConnectionForm.setError('root', {
					message: 'Unknwon error occures, try again or inform our Team',
				})
			}
		} finally {
			setLoading(false)
		}
	}

	if (status === 'pending') return <Spinner />
	if (status === 'error') return <ErrorInfo message="Can not fetch auth data" />

	return (
		<>
			<DialogHeader>
				<DialogTitle>New Connection</DialogTitle>
				<DialogDescription>This connection will be able to be used by {connector.displayName} connector </DialogDescription>
			</DialogHeader>
			<Form {...appConnectionForm}>
				<form className="space-y-8" onSubmit={onSubmit}>
					<FormField
						control={appConnectionForm.control}
						name={'name'}
						rules={{
							required: { value: true, message: 'Required field' },
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Connection Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<MarkdownBase>{auth.description}</MarkdownBase>
					<div className="h-1">
						{appConnectionForm.formState.errors.root && <FormMessage>{appConnectionForm.formState.errors.root.message}</FormMessage>}
					</div>
					<Button onClick={() => onConnectOAuth2()} className="w-full" type="button">
						Connect
					</Button>
					<DialogFooter>
						<Button onClick={() => setShowDialog(false)} disabled={loading} variant={'outline'}>
							Cancel
						</Button>
						<ButtonClient
							loading={loading}
							type="submit"
							disabled={!appConnectionForm.formState.isValid || !OAuth2Response || OAuth2Response.status === 'error'}
						>
							Save
						</ButtonClient>
					</DialogFooter>
				</form>
			</Form>
		</>
	)
}

interface OAuth2Settings {
	auth_url: string
	redirect_url: string
	scope: string
	pkce: boolean
	extraParams: object
	client_id: string
}

interface OAuth2ResponseSuccess {
	status: 'succees'
	code: string
	code_challenge?: string
}

interface OAuth2ResponseError {
	status: 'error'
	errorMessage: string
}

type OAuth2Response = OAuth2ResponseSuccess | OAuth2ResponseError
