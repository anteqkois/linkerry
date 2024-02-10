import { Action, Connector } from '@linkerry/connectors-framework'
import {
	ExecutePropsOptions,
	assertNotNullOrUndefined,
	extractConnectorFromModule,
	getPackageAliasForConnector
} from '@linkerry/shared'

const loadConnectorOrThrow = async ({
	connectorName,
	connectorVersion,
	connectorSource,
}: {
	connectorName: string
	connectorVersion: string
	connectorSource: string
}): Promise<Connector> => {
	const packageName = getPackageAlias({
		connectorName,
		connectorVersion,
		connectorSource,
	})

	const module = await import(packageName)
	const connector = extractConnectorFromModule<Connector>({
		module,
		connectorName,
		connectorVersion,
	})

	assertNotNullOrUndefined(connector, 'connector', {
		connectorName,
		connectorVersion,
	})

	return connector
}

const getConnectorAndActionOrThrow = async (params: {
	connectorName: string
	connectorVersion: string
	actionName: string
	connectorSource: string
}): Promise<{ connector: Connector; connectorAction: Action }> => {
	const { connectorName, connectorVersion, actionName, connectorSource } = params

	const connector = await loadConnectorOrThrow({ connectorName, connectorVersion, connectorSource })
	const connectorAction = connector.getAction(actionName)

	assertNotNullOrUndefined(connectorAction, 'connectorAction', {
		connectorName,
		connectorVersion,
		stepName: actionName,
	})

	return {
		connector,
		connectorAction,
	}
}

const getPropOrThrow = async ({ params, connectorSource }: { params: ExecutePropsOptions; connectorSource: string }) => {
	const { connector: connectorPackage, stepName, propertyName } = params

	const connector = await loadConnectorOrThrow({
		connectorName: connectorPackage.connectorName,
		connectorVersion: connectorPackage.connectorVersion,
		connectorSource,
	})

	const action = connector.getAction(stepName) ?? connector.getTrigger(stepName)

	assertNotNullOrUndefined(action, 'action', {
		connectorName: connectorPackage.connectorName,
		connectorVersion: connectorPackage.connectorVersion,
		stepName,
	})

	const props = action.props[propertyName]

	assertNotNullOrUndefined(props, 'props', {
		connectorName: connectorPackage.connectorName,
		connectorVersion: connectorPackage.connectorVersion,
		stepName,
		configName: propertyName,
	})

	return props
}

const getPackageAlias = ({
	connectorName,
	connectorVersion,
	connectorSource,
}: {
	connectorName: string
	connectorSource: string
	connectorVersion: string
}) => {
	if (connectorSource === 'FILE') {
		return connectorName
	}

	return getPackageAliasForConnector({
		connectorName,
		connectorVersion,
	})
}

export const connectorLoader = {
	loadConnectorOrThrow,
	getConnectorAndActionOrThrow,
	getPropOrThrow,
}
