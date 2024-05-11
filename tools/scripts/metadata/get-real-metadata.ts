import { Connector, ConnectorMetadata } from 'libs/connectors/framework/src'
import { ConnectorGroup, ConnectorType, PackageType } from 'libs/shared/src'
import { join } from 'path'
import { valid } from 'semver'
import { readPackageJson } from '../utils/files'
import { getAvailableConnectorNames } from '../utils/get-available-connector-names'

const skipConnectorsMetadata = ['@linkerry/common-exchanges', '@linkerry/connectors-common', '@linkerry/connectors-framework']
const customConnectors = []
const coreConnectors = ['@linkerry/linkerry-schedule']

export const getRealMetadata = async () => {
  const names = await getAvailableConnectorNames()
  console.log(`found ${names.length} packages`)

  const connectorsMetadata: Omit<ConnectorMetadata, '_id'>[] = []
  for (const packageName of names) {
    const packagePath = `libs/connectors/${packageName}`

    const packageJson = await readPackageJson(packagePath)
    const { name: connectorName, version: connectorVersion } = packageJson
    if (skipConnectorsMetadata.includes(connectorName)) {
      console.log(`skip ${connectorName}`)
      continue
    }

    const module = await import(join(packagePath, 'src', 'index'))
    const connector = extractConnectorFromModule({ module })

    const fullMetadata = connector.metadata()

    if (fullMetadata.auth) delete fullMetadata.auth.valueSchema

    const metadata: Omit<ConnectorMetadata, '_id'> = {
      ...fullMetadata,
      connectorType: customConnectors.includes(connectorName) ? ConnectorType.CUSTOM : ConnectorType.OFFICIAL,
      packageType: PackageType.REGISTRY,
      group: coreConnectors.includes(connectorName) ? ConnectorGroup.CORE : ConnectorGroup.APP,
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

// TODO duplicate code
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
