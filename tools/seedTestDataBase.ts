import mongoose from 'mongoose'
import { database } from './database'
import { alwaysExistingConditionAlert, alwaysExistingStrategy, alwaysExistingUser } from './models.mock'

const collectionToDelete = ['users', 'conditions', 'user-keys', 'strategies', 'strategies-buy']

export const seedDatabase = async () => {
  const db = await database

  // DELETE COLLECTION
  const collectionNames = (await db.connection.db.listCollections().toArray()).map(collection => collection.name)

  for (const collection of collectionToDelete) {
    if (collectionNames.includes(collection)) db.connection.dropCollection(collection)
  }
  console.log('[ Database cleaned ]');

  const User = db.model('User', new mongoose.Schema({}, { strict: false, _id: false }));
  const user = new User({
    _id: new mongoose.Types.ObjectId(alwaysExistingUser._id),
    consents: alwaysExistingUser.consents,
    email: alwaysExistingUser.email,
    language: alwaysExistingUser.language,
    name: alwaysExistingUser.name,
    password: alwaysExistingUser.encryptedPassword,
  });
  await user.save();

  const Condition = db.model('Condition', new mongoose.Schema({}, { strict: false, _id: false }));
  const condition = new Condition({
    ...alwaysExistingConditionAlert,
    _id: new mongoose.Types.ObjectId(alwaysExistingConditionAlert._id),
    user: new mongoose.Types.ObjectId(alwaysExistingConditionAlert.user),
  });
  condition.save()

  const Strategy = db.model('Strategy', new mongoose.Schema({}, { strict: false, _id: false }));
  const strategy = new Strategy({
    ...alwaysExistingStrategy,
    _id: new mongoose.Types.ObjectId(alwaysExistingStrategy._id),
    user: new mongoose.Types.ObjectId(alwaysExistingStrategy.user),
  });
  strategy.save()

  await new Promise(r => setTimeout(r, 2000))

  console.log('[ Database seeded ]');

  console.log('[ Wait secure time buffor ]');
  await new Promise(r => r(setTimeout(r, 2000)))
}
