import { IUserSettings } from '@market-connector/types'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { UserModel } from '../../users'

export type UserSettingsDocument = mongoose.HydratedDocument<UserSetting>

@Schema({ timestamps: true, collection:'strategies-settings' })
export class UserSetting implements IUserSettings {
  _id: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: UserModel
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSetting)
