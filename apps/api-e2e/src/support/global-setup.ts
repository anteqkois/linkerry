import mongoose from 'mongoose'
import { database } from '../../../../tools/database'

/* eslint-disable */
var __TEARDOWN_MESSAGE__: string

const collectionToDelete = ['customers']

module.exports = async function () {
  // Start services that that the app needs to run (e.g. database, docker-compose, etc.).
  console.log('\nSetting up...\n')

  const db = await database

  const collectionNames = (await db.connection.db.listCollections().toArray()).map(collection => collection.name)

  for (const collection of collectionToDelete) {
    if (collectionNames.includes(collection)) db.connection.dropCollection(collection)
  }

  console.log('[ CLEANED DATABASE ]');
  await db.connection.createCollection('customers')

  const Customer = db.model('Customer', new mongoose.Schema({}, { strict: false }));
  const customer = new Customer({
    consents: {
      test1: true,
      test2: true,
    },
    email: 'anteqkois@gmail.com',
    language: 'Polish',
    name: 'anteqkois',
    password: 'antekkoisA',
  });
  await customer.save();
  // console.log('Customer real user for test:', customer);

  await new Promise(r => setTimeout(r, 2000))

  // Hint: Use `globalThis` to pass variables to global teardown.
  globalThis.__TEARDOWN_MESSAGE__ = '\nTearing down...\n'
}
