import mongoose from 'mongoose'
import { database } from '../../../../tools/database'
import { existingUser } from './test-veriables'

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string

const collectionToDelete = ['users']

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n')

  const db = await database

  // DELETE COLLECTION
  const collectionNames = (await db.connection.db.listCollections().toArray()).map(collection => collection.name)

  for (const collection of collectionToDelete) {
    if (collectionNames.includes(collection)) db.connection.dropCollection(collection)
  }

  const User = db.model('User', new mongoose.Schema({}, { strict: false }));
  // await User.deleteMany({})

  const user = new User({
    consents: existingUser.consents,
    email: existingUser.email,
    language: existingUser.language,
    name: existingUser.name,
    password: '$2b$10$2SpfVPkBcknXuHPe1GbqMO1KPrmya6DCQ1prYAr3.lEfp2CfVF6Oa',
  });
  await user.save();
  await new Promise(r => setTimeout(r, 2000))

  console.log('[ CLEANED DATABASE ]');

  // const User = db.model('User', new mongoose.Schema({}, { strict: false }));
  // const user = new User({
  //   consents: {
  //     test1: true,
  //     test2: true,
  //   },
  //   email: 'anteqkois@gmail.com',
  //   language: 'Polish',
  //   name: 'anteqkois',
  //   password: 'antekkoisA',
  // });
  // await user.save();
  // await new Promise(r => setTimeout(r, 2000))

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n'
}
