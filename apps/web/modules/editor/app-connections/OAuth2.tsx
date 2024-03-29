import { OAuth2Property } from '@linkerry/connectors-framework'
import { assertNotNullOrUndefined } from '@linkerry/shared'
import { HTMLAttributes, useEffect, useState } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { OAuth2AppsQueryConfig } from '../../app-connections/query-configs-apps'

export interface CustomAuthElementProps extends HTMLAttributes<HTMLElement> {
	auth: OAuth2Property<any>
	connectorName: string
}

interface OAuth2Settings {
	auth_url: string
	redirect_url: string
	scope: string
	pkce: boolean
	extraParams: object
	client_id: string
}

export const OAuth2 = ({ auth, connectorName }: CustomAuthElementProps) => {
	const { data, status } = useClientQuery(OAuth2AppsQueryConfig.getManyApps())

	const [oAoth2Settings, setOAoth2Settings] = useState<OAuth2Settings | null>(null)

	useEffect(() => {
		if (status !== 'success') return
		const app = data.find((app) => app.connectorName === connectorName)
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

	if (status === 'pending') return <Spinner />
	if (status === 'error') return <ErrorInfo message="Can not fetch auth data" />

	return null
	// return Object.entries(props).map(([name, property]) => <DynamicField property={property} name={name} key={name} refreshedProperties={[]} />)
}
