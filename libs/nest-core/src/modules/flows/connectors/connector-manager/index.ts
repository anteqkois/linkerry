import { ConnectorsSource } from "@linkerry/shared"
import { ConnectorManager } from "./base-manager"
import { RegistryConnectorManager } from "./registry-manager"

const source = process.env['CONNECTORS_SOURCE'] as ConnectorsSource.Db

const getConnectorManager = (): ConnectorManager => {
    // const connectorManagerVariant: Record<ConnectorsSource, new () => ConnectorManager> = {
    const connectorManagerVariant: Record<ConnectorsSource.Db, new () => ConnectorManager> = {
        // [ConnectorsSource.File]: LocalConnectorManager,
        // [ConnectorsSource.CloudAndDb]: RegistryConnectorManager,
        [ConnectorsSource.Db]: RegistryConnectorManager,
    }

    return new connectorManagerVariant[source]()
}

export const connectorManager = getConnectorManager()
