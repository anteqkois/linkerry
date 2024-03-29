import { ConnectorMetadata, OAuth2Property } from '@linkerry/connectors-framework'
import { AppConnectionWithoutSensitiveData, assertNotNullOrUndefined } from '@linkerry/shared'
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
import Markdown from 'react-markdown'
import { useClientQuery } from '../../../libs/react-query'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { OAuth2AppsQueryConfig } from '../../app-connections/query-configs-apps'

export interface OAuth2AuthProps extends HTMLAttributes<HTMLElement> {
	onCreateAppConnection: (newConnection: AppConnectionWithoutSensitiveData) => void
	auth: OAuth2Property<any>
	connector: Pick<ConnectorMetadata, 'displayName' | 'name'>
	setShowDialog: Dispatch<SetStateAction<boolean>>
}
export const OAuth2Auth = ({ onCreateAppConnection, auth, connector, setShowDialog }: OAuth2AuthProps) => {
	const { data, status } = useClientQuery(OAuth2AppsQueryConfig.getManyApps())
	const [oAoth2Settings, setOAoth2Settings] = useState<OAuth2Settings | null>(null)

	useEffect(() => {
		if (status !== 'success') return
		const app = data.find((app) => app.connectorName === connector.name)
		assertNotNullOrUndefined(app, 'app')

		setOAoth2Settings({
			auth_url: auth.authUrl,
			redirect_url: `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/oauth2/redirect`,
			scope: auth.scope.join(' '),
			pkce: auth.pkce ?? false,
			extraParams: auth.extra || {},
			client_id: app.clientId,
		})
	}, [status])

	const { toast } = useToast()
	const [loading, setLoading] = useState(false)
	const appConnectionForm = useForm<{ name: string } & Record<string, any>>({
		mode: 'all',
		defaultValues: {
			name: `${connector.name.replace('@linkerry/', '').toLocaleLowerCase()}-${dayjs().unix()}`,
		},
	})

	const [currentOpenedWindow, setCurrentOpenedWindow] = useState<Window | null>()
	const constructRedirectUrl = useCallback(
		(pckeChallenge: string) => {
			assertNotNullOrUndefined(oAoth2Settings, 'oAoth2Settings')

			const queryParams: Record<string, string> = {
				response_type: 'code',
				client_id: oAoth2Settings.client_id,
				redirect_uri: oAoth2Settings.redirect_url,
				access_type: 'offline',
				state: nanoid(),
				prompt: 'consent',
				scope: oAoth2Settings.scope,
				...oAoth2Settings.extraParams,
			}

			if (oAoth2Settings.pkce) {
				const code_challenge = pckeChallenge
				queryParams['code_challenge_method'] = 'plain'
				queryParams['code_challenge'] = code_challenge
			}

			const url = new URL(oAoth2Settings.auth_url)

			Object.entries(queryParams).forEach(([key, value]) => {
				url.searchParams.append(key, value)
			})

			return url.toString()
		},
		[oAoth2Settings],
	)

	const openWindow = (url: string): Window | null => {
		const windowFeatures =
			'resizable=no, toolbar=no,left=100, top=100, scrollbars=no, menubar=no, status=no, directories=no, location=no, width=600, height=800'
		return window.open(url, '_blank', windowFeatures)
	}

	const observeForResponse = (redirectUrl: string, pkce: boolean | undefined, pckeChallenge: string | undefined, popup: Window | null) => {
		window.addEventListener('message', function handler(event) {
			if (redirectUrl && redirectUrl.startsWith(event.origin) && event.data['code']) {
				// event.data.code = decodeURIComponent(event.data.code);
				// observer.next(event.data);
				// popup?.close();
				// observer.complete();
				// window.removeEventListener('message', handler);
				// second stage
				//  if (params != undefined && params.code != undefined) {
				//   return {
				//     code: params.code,
				//     code_challenge: pkce ? pckeChallenge : undefined,
				//   };
				// }
				// throw new Error(
				//   `Params for openPopUp is empty or the code is, params:${params}`
				// );
			}
		})
	}

	const onConnectOAuth2 = () => {
		currentOpenedWindow?.close()

		const pckeChallenge = nanoid()
		const redirectUrl = constructRedirectUrl(pckeChallenge)
		const newWidnow = openWindow(redirectUrl)
		setCurrentOpenedWindow(window)
	}

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!appConnectionForm.formState.isValid) return
		setLoading(true)
		appConnectionForm.clearErrors()

		const { name, ...formData } = appConnectionForm.getValues()

		// let input: UpsertAppConnectionInput

		// switch (auth.type) {
		// 	case PropertyType.CUSTOM_AUTH:
		// 		input = {
		// 			connectorName: connector.name,
		// 			name: name,
		// 			type: AppConnectionType.CUSTOM_AUTH,
		// 			value: {
		// 				type: AppConnectionType.CUSTOM_AUTH,
		// 				props: formData,
		// 			},
		// 		}
		// 		break
		// 	case PropertyType.OAUTH2:
		// 	case PropertyType.BASIC_AUTH:
		// 	case PropertyType.SECRET_TEXT:
		// 		setLoading(false)
		// 		throw new Error(`Unsupoerted auth type ${auth.type}`)
		// }

		// try {
		// 	const { data } = await AppConnectionsApi.upsert(input)

		// 	toast({
		// 		title: `Connection ${data.name} was succesfully saved`,
		// 		description: 'You can now use this connection through all of your flows.',
		// 		variant: 'success',
		// 	})

		// 	onCreateAppConnection(data)
		// 	setShowDialog(false)
		// } catch (error: any) {
		// 	if (isCustomHttpExceptionAxios(error))
		// 		appConnectionForm.setError('root', {
		// 			message: error.response.data.message,
		// 		})
		// 	else {
		// 		appConnectionForm.setError('root', {
		// 			message: 'Unknwon error occures, try again or inform our Team',
		// 		})
		// 	}
		// } finally {
		// 	setLoading(false)
		// }
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
				<form className="space-y-5" onSubmit={onSubmit}>
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
					<Markdown>{auth.description}</Markdown>
					<div className="h-1">
						{appConnectionForm.formState.errors.root && <FormMessage>{appConnectionForm.formState.errors.root.message}</FormMessage>}
					</div>
					<Button onClick={() => onConnectOAuth2()} size={'lg'} className="w-full">
						Connect
					</Button>
					<DialogFooter>
						<Button onClick={() => setShowDialog(false)} disabled={loading} variant={'outline'}>
							Cancel
						</Button>
						<ButtonClient loading={loading} type="submit" disabled={!appConnectionForm.formState.isValid}>
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
