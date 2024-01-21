import { Action, Connector } from "@linkerry/connectors-framework"
import { CustomError, ErrorCode, ExecutePropsOptions, extractConnectorFromModule, getPackageAliasForConnector, isNull } from "@linkerry/shared"

const loadConnectorOrThrow = async (
    { connectorName, connectorVersion, connectorSource }:
    { connectorName: string, connectorVersion: string, connectorSource: string },
): Promise<Connector> => {
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

    if (isNull(connector)) {
        throw new CustomError({
            code: ErrorCode.CONNECTOR_NOT_FOUND,
            params: {
                connectorName,
                connectorVersion,
            },
        })
    }

    return connector
}

const getConnectorAndActionOrThrow = async (params: {
    connectorName: string
    connectorVersion: string
    actionName: string
    connectorSource: string
},
): Promise<{ connector: Connector, connectorAction: Action }> => {
    const { connectorName, connectorVersion, actionName, connectorSource } = params

    const connector = await loadConnectorOrThrow({ connectorName, connectorVersion, connectorSource })
    const connectorAction = connector.getAction(actionName)

    if (isNull(connectorAction)) {
        throw new CustomError({
            code: ErrorCode.STEP_NOT_FOUND,
            params: {
                connectorName,
                connectorVersion,
                stepName: actionName,
            },
        })
    }

    return {
        connector,
        connectorAction,
    }
}

const getPropOrThrow = async ({ params, connectorSource }: { params: ExecutePropsOptions, connectorSource: string }) => {
    const { connector: connectorPackage, stepName, propertyName } = params

    const connector = await loadConnectorOrThrow({ connectorName: connectorPackage.connectorName, connectorVersion: connectorPackage.connectorVersion, connectorSource })

    const action = connector.getAction(stepName) ?? connector.getTrigger(stepName)

    if (isNull(action)) {
        throw new CustomError({
            code: ErrorCode.STEP_NOT_FOUND,
            params: {
                connectorName: connectorPackage.connectorName,
                connectorVersion: connectorPackage.connectorVersion,
                stepName,
            },
        })
    }

    const prop = action.props[propertyName]

    if (isNull(prop)) {
        throw new CustomError({
            code: ErrorCode.CONFIG_NOT_FOUND,
            params: {
                connectorName: connectorPackage.connectorName,
                connectorVersion: connectorPackage.connectorVersion,
                stepName,
                configName: propertyName,
            },
        })
    }

    return prop
}

const getPackageAlias = ({ connectorName, connectorVersion, connectorSource }: {
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
