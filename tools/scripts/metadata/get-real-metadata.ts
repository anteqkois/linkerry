import { readdir } from 'fs/promises'
import { Connector, ConnectorMetadata } from 'libs/connectors/framework/src'
import { valid } from 'semver'
import { readPackageJson } from '../utils/files'

export const getRealMetadata = async () => {
  const names = await getAvailableConnectorNames()
  console.log(`found ${names.length} connectors`)

  const connectorsMetadata: ConnectorMetadata[] = []
  for (const packageName of names) {
    const packagePath = `libs/connectors/${packageName}`

    const packageJson = await readPackageJson(packagePath)

    const module = await import(`${packagePath}/src/index.ts`)
    const { name: connectorName, version: connectorVersion } = packageJson
    const connector = extractConnectorFromModule({ module })

    const metadata: ConnectorMetadata = {
      ...connector.metadata(),
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

const getAvailableConnectorNames = async (): Promise<string[]> => {
  const ignoredPackages = ['framework', 'apps', 'dist', 'common']
  const packageNames = await readdir('libs/connectors')
  return packageNames.filter((p) => !ignoredPackages.includes(p))
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
