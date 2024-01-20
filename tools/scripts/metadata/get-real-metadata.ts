import { Connector, ConnectorMetadata } from 'libs/connectors/framework/src'
import { ConnectorGroup, ConnectorType } from 'libs/shared/src'
import { valid } from 'semver'
import { readPackageJson } from '../utils/files'
import { getAvailableConnectorNames } from '../utils/get-available-connector-names'

const customConnectors = []
const coreConnectors = ['@linkerry/linkerry-schedule']

export const getRealMetadata = async () => {
  const names = await getAvailableConnectorNames()
  console.log(`found ${names.length} connectors`)

  const connectorsMetadata: Omit<ConnectorMetadata, '_id'>[] = []
  for (const packageName of names) {
    const packagePath = `libs/connectors/${packageName}`

    const packageJson = await readPackageJson(packagePath)

    const module = await import(`${packagePath}/src/index.ts`)
    const { name: connectorName, version: connectorVersion } = packageJson
    const connector = extractConnectorFromModule({ module })

    const metadata: Omit<ConnectorMetadata, '_id'> = {
      ...connector.metadata(),
      connectorType: customConnectors.includes(connector.name) ? ConnectorType.Custom : ConnectorType.Official,
      group: coreConnectors.includes(connector.name) ? ConnectorGroup.Core : ConnectorGroup.App,
      name: connectorName,
      version: connectorVersion,
      minimumSupportedRelease: connector.minimumSupportedRelease,
      maximumSupportedRelease: connector.maximumSupportedRelease,
    }

    if (!valid(metadata.minimumSupportedRelease) || !valid(metadata.maximumSupportedRelease))
      throw new Error(`Invalid semantic version of connector ${metadata.name}@${metadata.version}`)

    connectorsMetadata.push(metadata)
  }

  return connectorsMetadata
}

const extractConnectorFromModule = (params: { module: Record<string, unknown> }) => {
  const { module } = params
  const exports = Object.values(module)

  for (const e of exports) {
    if (e !== null && e !== undefined && e.constructor.name === 'Connector') {
      return e as Connector
    }
  }
  throw new Error("Can't find constructor")
}
