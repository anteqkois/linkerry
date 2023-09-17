import { ExchangeCode, IUserKeys} from '@market-connector/types'
import { Id } from '@market-connector/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type UserKeysDocument = mongoose.HydratedDocument<IUserKeys>

@Schema({ timestamps: true, collection:'user-keys' })
export class UserKeys implements IUserKeys {
  _id: string

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user: Id

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Exchanges' })
  exchange: Id

  @Prop({ required: true, type: String, enum: ExchangeCode })
  exchangeCode: ExchangeCode

  @Prop({ required: true, type: String })
  aKey: string

  @Prop({ required: true, type: String })
  aKeyInfo: string

  @Prop({ required: true, type: String })
  sKey: string

  @Prop({ required: true, type: String })
  sKeyInfo: string

  @Prop({ required: true, type: Number })
  kv: number

  @Prop({ required: true, type: String })
  salt: string
}

export const UserKeysSchema = SchemaFactory.createForClass(UserKeys)
UserKeysSchema.index({ name: 1, user: 1 }, { unique: true, sparse: true })

export const userKeysModelFactory: AsyncModelFactory = {
  name: UserKeys.name,
  imports: [],
  useFactory: () => {
    const schema = UserKeysSchema
    schema.plugin(require('mongoose-unique-validator'), {
      message: 'Error, expected {PATH} to be unique. Received {VALUE}',
    })
    return schema
  },
  inject: [],
}
