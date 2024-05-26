import 'dotenv/config'
import mongoose from 'mongoose'

const protocol = process.env.MONGO_PROTOCOL ?? ''
const username = process.env.MONGO_USERNAME ?? ''
const password = process.env.MONGO_PASSWORD ?? ''
const host = process.env.MONGO_HOST ?? ''
const port = process.env.MONGO_PORT ?? ''
const db = process.env.MONGO_DATABASE ?? ''

const protocol_prod = process.env.MONGO_PROD_PROTOCOL ?? ''
const username_prod = process.env.MONGO_PROD_USERNAME ?? ''
const password_prod = process.env.MONGO_PROD_PASSWORD ?? ''
const host_prod = process.env.MONGO_PROD_HOST ?? ''
const port_prod = process.env.MONGO_PROD_PORT ?? ''
const db_prod = process.env.MONGO_PROD_DATABASE ?? ''

const uri_test = `${protocol}://${username}:${password}@${host}${port ? ':' + port : ''}${db ? '/' + db : ''}`
const uri_prod = `${protocol_prod}://${username_prod}:${password_prod}@${host_prod}${port_prod ? ':' + port_prod : ''}${db_prod ? '/' + db_prod : ''}`

let database: typeof mongoose

export const getDb = async () => {
  if (database) return database
  const _uri = process.env.NODE_ENV === 'production' ? uri_prod : uri_test
  database = await mongoose.connect(_uri, {
    // useUnifiedTopology: true,
    // useNewUrlParser: true,
    autoIndex: false, //make this also true
    // useCreateIndex: true, //make this true
  })

  return database
}
