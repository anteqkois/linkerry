import { UserSettings } from '@market-connector/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { UserModel } from '../../users'

export type UserSettingsDocument = mongoose.HydratedDocument<UserSettingsModel>

@Schema({ timestamps: true, collection:'strategies-settings' })
export class UserSettingsModel implements UserSettings {
  _id: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserModel
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettingsModel)
