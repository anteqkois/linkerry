import { getRealMetadata } from './get-real-metadata'
import { insertMetadata } from './insert-metadata'

const main = async () => {
  const connectorsMetadata = await getRealMetadata()
  await insertMetadata(connectorsMetadata)

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
