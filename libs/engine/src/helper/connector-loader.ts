import { Action, Connector } from '@linkerry/connectors-framework'
import {
	CustomError,
	ErrorCode,
	ExecutePropsOptions,
	assertNotNullOrUndefined,
	extractConnectorFromModule,
	getPackageAliasForConnector,
} from '@linkerry/shared'

const loadConnectorOrThrow = async ({
	connectorName,
	connectorVersion,
	connectorsSource,
}: {
	connectorName: string
	connectorVersion: string
	connectorsSource: string
}): Promise<Connector> => {
	const packageName = getPackageAlias({
		connectorName,
		connectorVersion,
		connectorsSource,
	})

	try {
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
	} catch (error) {
		console.error(error)
		throw new CustomError(`Can not load ${packageName} connector`, ErrorCode.CONNECTOR_NOT_FOUND, {
			packageName,
			connectorName,
			connectorVersion,
			connectorsSource,
		})
	}
}

const getConnectorAndActionOrThrow = async (params: {
	connectorName: string
	connectorVersion: string
	actionName: string
	connectorsSource: string
}): Promise<{ connector: Connector; connectorAction: Action }> => {
	const { connectorName, connectorVersion, actionName, connectorsSource } = params

	const connector = await loadConnectorOrThrow({ connectorName, connectorVersion, connectorsSource })
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

const getPropOrThrow = async ({ params, connectorsSource }: { params: ExecutePropsOptions; connectorsSource: string }) => {
	const { connector: connectorPackage, stepName, propertyName } = params

	const connector = await loadConnectorOrThrow({
		connectorName: connectorPackage.connectorName,
		connectorVersion: connectorPackage.connectorVersion,
		connectorsSource,
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
	connectorsSource,
}: {
	connectorName: string
	connectorsSource: string
	connectorVersion: string
}) => {
	if (connectorsSource === 'FILE') {
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
