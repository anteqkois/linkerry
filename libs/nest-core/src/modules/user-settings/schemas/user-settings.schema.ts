import { User, UserSettings } from '@linkerry/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { BaseDatabaseModel, ObjectId } from '../../../lib/mongodb'

export type UserSettingsDocument = mongoose.HydratedDocument<UserSettingsModel>

@Schema({ timestamps: true, collection: 'user_settings' })
export class UserSettingsModel extends BaseDatabaseModel implements Omit<UserSettings, 'userId' | 'user'> {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  userId: ObjectId

  user?: User
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettingsModel)
// TODO add virtual
