import mongoose from 'mongoose'
import { database } from './database'
import { alwaysExistingAlert, alwaysExistingUser } from './models.mock'

const collectionToDelete = ['users', 'alerts']

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

  const Alert = db.model('ALERT', new mongoose.Schema({}, { strict: false, _id: false }));
  const alert = new Alert({
    ...alwaysExistingAlert,
    _id: new mongoose.Types.ObjectId(alwaysExistingAlert._id),
    userId: new mongoose.Types.ObjectId(alwaysExistingAlert.userId),
    conditionId: new mongoose.Types.ObjectId(alwaysExistingAlert.conditionId)
  });

  await new Promise(r => setTimeout(r, 2000))

  console.log('[ Database seeded ]');

  console.log('[ Wait secure time buffor ]');
  await new Promise(r => r(setTimeout(r, 2000)))
}
