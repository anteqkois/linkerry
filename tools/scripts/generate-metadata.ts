import { readdir } from 'fs/promises'
import { Connector, ConnectorMetadata } from 'libs/connectors/framework/src'
import { mongo } from 'mongoose'
import { valid } from 'semver'
import { getDb } from '../database'
import { readPackageJson } from './utils/files'

const getAvailableConnectorNames = async (): Promise<string[]> => {
  const ignoredPackages = ['framework', 'apps', 'dist', 'common']
  const packageNames = await readdir('libs/connectors')
  return packageNames.filter((p) => !ignoredPackages.includes(p))
}

const main = async () => {
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

  const db = await getDb()
  const connectorsMetadataModel = db.connection.db.collection<ConnectorMetadata>('connectors_metadata')
  const bulkInsert: mongo.AnyBulkWriteOperation<ConnectorMetadata>[] = []

  for (const metadata of connectorsMetadata) {
    console.log(`insert ${metadata.name}@${metadata.version}`)
    const response = await connectorsMetadataModel.findOne({
      name: metadata.name,
      version: metadata.version,
    })

    if (response) return console.log(`connector metadata exists ${metadata.name}@${metadata.version}`)
    bulkInsert.push({
      insertOne: {
        document: metadata,
      },
    })
  }

  const response = await connectorsMetadataModel.bulkWrite(bulkInsert)
  console.log(`inserted ${response.insertedCount} connectors metadata`)
}

export const extractConnectorFromModule = (params: { module: Record<string, unknown> }) => {
  const { module } = params
  const exports = Object.values(module)

  for (const e of exports) {
    if (e !== null && e !== undefined && e.constructor.name === 'Connector') {
      return e as Connector
    }
  }
  throw new Error("Can't find constructor")
}

main()
  .then()
  .catch((err) => console.log(err))
