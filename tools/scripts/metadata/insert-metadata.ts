import { ConnectorMetadata } from 'libs/connectors/framework/src'
import { mongo } from 'mongoose'
import { getDb } from '../../db/database'

export const insertMetadata = async (data: Omit<ConnectorMetadata, '_id'>[]) => {
  const db = await getDb()
  const connectorsMetadataModel = db.connection.db.collection<ConnectorMetadata>('connectors_metadata')
  const bulkInsert: mongo.AnyBulkWriteOperation<ConnectorMetadata>[] = []

  const existingMetadata = await connectorsMetadataModel
    .find(
      {
        $or: data.map((metadata) => ({
          name: metadata.name,
          version: metadata.version,
        })),
      },
      { projection: { name: 1 } },
    )
    .toArray()

  if (existingMetadata.length) {
    console.log(`found ${existingMetadata.length} existing metadata with given name and version`)
    const existingNames = existingMetadata.map((m) => m.name)

    data = data.filter((metadata) => {
      if (!existingNames.includes(metadata.name)) return true
      console.log(`skip ${metadata.name}@${metadata.version}`)
      return false
    })
  }

  for (const metadata of data) {
    console.log(`insert ${metadata.name}@${metadata.version}`)
    const response = await connectorsMetadataModel.findOne({
      name: metadata.name,
      version: metadata.version,
    })

    if (response) {
      console.log(`connector metadata exists ${metadata.name}@${metadata.version}`)
      continue
    }

    bulkInsert.push({
      insertOne: {
        document: metadata,
      },
    })
  }

  if (!bulkInsert.length) return console.log(`No metadata to insert`)
  const response = await connectorsMetadataModel.bulkWrite(bulkInsert)
  console.log(`inserted ${response.insertedCount} connectors metadata`)
}
