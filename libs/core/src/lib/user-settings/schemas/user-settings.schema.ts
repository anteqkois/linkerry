import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserSettingsDocument = HydratedDocument<UserSetting>;

@Schema({ timestamps: true,})
export class UserSetting {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;
}

export const UserSettingsSchema = SchemaFactory.createForClass(UserSetting);
