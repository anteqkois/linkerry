import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type UserSettingsDocument = mongoose.HydratedDocument<UserSetting>;

@Schema({ timestamps: true,})
export class UserSetting {
  _id: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSetting);
