import mongoose from 'mongoose'
import { database } from './database'
import { alwaysExistingConditionAlert, alwaysExistingStrategyBuyStaticMarket, alwaysExistingStrategyStaticMarket, alwaysExistingUser } from './models.mock'

const collectionToDelete = ['users', 'conditions', 'user-keys', 'strategies', 'strategies-buy', 'flows', 'flow-versions']

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
    ...alwaysExistingStrategyStaticMarket,
    _id: new mongoose.Types.ObjectId(alwaysExistingStrategyStaticMarket._id),
    user: new mongoose.Types.ObjectId(alwaysExistingStrategyStaticMarket.user),
  });
  strategy.save()

  const StrategyBuy = db.model('StrategyBuy', new mongoose.Schema({}, { strict: false, _id: false, collection:'strategies-buy' }));
  const strategyBuy = new StrategyBuy({
    ...alwaysExistingStrategyBuyStaticMarket,
    _id: new mongoose.Types.ObjectId(alwaysExistingStrategyBuyStaticMarket._id),
    user: new mongoose.Types.ObjectId(alwaysExistingStrategyBuyStaticMarket.user),
  });
  strategyBuy.save()

  await new Promise(r => setTimeout(r, 2000))

  console.log('[ Database seeded ]');

  console.log('[ Wait secure time buffor ]');
  await new Promise(r => r(setTimeout(r, 2000)))
}
