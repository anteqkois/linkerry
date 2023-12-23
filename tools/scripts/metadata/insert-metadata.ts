import { ConnectorMetadata } from 'libs/connectors/framework/src'
import { mongo } from 'mongoose'
import { getDb } from '../../database'

export const insertMetadata = async (data: ConnectorMetadata[]) => {
  const db = await getDb()
  const connectorsMetadataModel = db.connection.db.collection<ConnectorMetadata>('connectors_metadata')
  const bulkInsert: mongo.AnyBulkWriteOperation<ConnectorMetadata>[] = []

  for (const metadata of data) {
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
