import { User, UserMetadata, UserRole } from '@market-connector/shared'
import { Language } from '@market-connector/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { UserSettingsModel } from '../../user-settings/schemas/user-settings.schema'

export type UserDocument = mongoose.HydratedDocument<User>

class UserMetadataModel implements UserMetadata {
  @Prop({ required: false, type: Boolean })
  earlyAdopter?: boolean
}

export const UserMetadataSchema = SchemaFactory.createForClass(UserMetadataModel)

@Schema({ timestamps: true, autoIndex: true, collection: 'users' })
export class UserModel implements User {
  _id: string

  @Prop({ required: true, type: String, unique: true, index: true })
  name!: string

  @Prop({ type: [{ type: String, enum: UserRole, default: UserRole.Customer }] })
  roles: UserRole[]

  @Prop({ required: false, type: String })
  phone: string

  @Prop({ required: true, type: String, unique: true })
  email!: string

  @Prop({ required: false, type: Date })
  emailVerifiedAtDate: Date

  @Prop({ required: true, type: String })
  password: string

  @Prop({ required: false, type: Date })
  trialExpiredAtDate: Date

  @Prop({ required: false, type: Date })
  trialStartedAtDate: Date

  @Prop({ required: false, type: Date })
  deletedAtDate: Date

  @Prop({ required: false, type: String })
  cryptoWallet: string

  @Prop({ required: true, type: String, enum: Language, default: Language.pl })
  language: Language

  @Prop({ required: true, type: Number, default: 10 })
  affiliationPercent: number

  @Prop({ required: true, type: Object })
  consents: Record<string, boolean>

  // Shoulde be created almost one when user was created
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: UserSettingsModel.name })
  settings: any

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  // referrer: IUser;
  referrer: string

  @Prop({ required: false, type: UserMetadataSchema })
  metadata?: UserMetadata
  // remember_token             String?   @db.VarChar(100)
  // subscription_expired_at    DateTime? @db.Date
  // current_plan_id            BigInt?   @db.UnsignedBigInt
}

export const UserSchema = SchemaFactory.createForClass(UserModel)
UserSchema.index({ phone: 1 }, { unique: true, sparse: true })
UserSchema.index({ cryptoWallet: 1 }, { unique: true, sparse: true })

export const userModelFactory: AsyncModelFactory = {
  name: UserModel.name,
  imports: [],
  useFactory: () => {
    const schema = UserSchema
    schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema
  },
  inject: [],
}
