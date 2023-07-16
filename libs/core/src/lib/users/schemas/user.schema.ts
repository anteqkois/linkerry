import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LanguageType } from '../../languages';
import { UserRoleTypes } from '../types';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true, autoIndex: true })
export class User {
  @Prop({ required: true, type: String, unique: true, index: true })
  name!: string;

  @Prop({ type: [{ type: String, enum: UserRoleTypes, default: UserRoleTypes.CUSTOMER }] })
  roles: UserRoleTypes[];

  @Prop({ required: false, type: String })
  phone: string;

  @Prop({ required: false, type: String })
  telegramId: string;

  @Prop({ required: true, type: Boolean, default: false })
  telegramBotConnected: boolean;

  @Prop({ required: true, type: String, unique: true })
  email!: string;

  @Prop({ required: false, type: Date })
  emailVerifiedAtDate: Date;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: Date })
  trialExpiredAtDate: Date;

  @Prop({ required: false, type: Date })
  trialStartedAtDate: Date;

  @Prop({ required: false, type: Date })
  deletedAtDate: Date;

  @Prop({ required: false, type: String })
  cryptoWallet: string;

  @Prop({ required: true, type: String, enum: LanguageType, default: LanguageType.pl })
  language: LanguageType;

  @Prop({ required: true, type: Number, default: 10 })
  affiliationPercent: number;

  @Prop({ required: true, type: Object })
  consents: Record<string, boolean>;

  // Shoulde be created almost one when user was created
  @Prop({ required: false, type: Types.ObjectId, ref: 'UserSettings' })
  settingsId: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Users' })
  referrerId: Types.ObjectId;

  // remember_token             String?   @db.VarChar(100)
  // subscription_expired_at    DateTime? @db.Date
  // current_plan_id            BigInt?   @db.UnsignedBigInt
  // meta_data                  Json?
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ phone: 1 }, { unique: true, sparse: true })
UserSchema.index({ cryptoWallet: 1 }, { unique: true, sparse: true })

export const userModelFactory: AsyncModelFactory = {
  name: User.name,
  imports: [],
  useFactory: () => {
    const schema = UserSchema;
    schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema;
  },
  inject: [],
};
