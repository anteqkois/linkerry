import { User, UserSettings } from '@linkerry/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type UserSettingsDocument = mongoose.HydratedDocument<UserSettingsModel>

@Schema({ timestamps: true, collection:'user-settings' })
export class UserSettingsModel implements UserSettings {
  _id: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'user' })
  user: User
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSettingsModel)
