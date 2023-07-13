import mongoose from 'mongoose';

const protocol = process.env.MONGO_PROTOCOL ?? '';
const username = process.env.MONGO_USERNAME ?? '';
const password = process.env.MONGO_PASSWORD ?? '';
const host = process.env.MONGO_HOST ?? '';
const port = process.env.MONGO_PORT ?? '';
const db = process.env.MONGO_DATABASE ?? '';

const uri = `${ protocol }://${ username }:${ password }@${ host }${ port ? (':' + port) : '' }${ db ? ('/' + db) : '' }`;

const database = mongoose
  .connect(uri, {
    // useUnifiedTopology: true,
    // useNewUrlParser: true,
    autoIndex: false, //make this also true
    // useCreateIndex: true, //make this true
  })

console.log(`Server connected with database`);
export { database };
