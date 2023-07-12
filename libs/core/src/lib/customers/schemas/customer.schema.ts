import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { LanguageType } from '../../languages';
import { CustomerRoleTypes } from '../types';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true, versionKey: true })
export class Customer {
  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: [CustomerRoleTypes], default: [CustomerRoleTypes.CUSTOMER] })
  roles: CustomerRoleTypes[];

  @Prop({ required: false, type: String })
  phone: string;

  @Prop({ required: false, type: String })
  telegramId: string;

  @Prop({ required: true, type: Boolean, default: false })
  telegramBotConnected: boolean;

  @Prop({ required: true, type: String })
  email: String;

  @Prop({ required: false, type: Date })
  emailVerifiedAtDate: Date;

  @Prop({ required: true, type: String })
  password: string;

  @Prop({ required: false, type: Date })
  trialExpiredAtDate: Date;

  @Prop({ required: false, type: Date })
  trialStartedAtDate: Date;

  @Prop({ required: true, type: String })
  deletedAtDate: string;

  @Prop({ required: false, type: String, unique: true })
  cryptoWallet: string;

  @Prop({ required: true, type: LanguageType, default: LanguageType.pl })
  language: LanguageType;

  @Prop({ required: true, type: Number, default: 10 })
  affiliationPercent: number;

  @Prop({ required: true, type: Object })
  consents: Record<string, boolean>;

  // Shoulde be created almost one when customer was created
  @Prop({ required: false, type: Types.ObjectId, ref: 'CustomerSettings' })
  settingsId: Types.ObjectId;

  @Prop({ required: false, type: Types.ObjectId, ref: 'Customers' })
  referrerId: Types.ObjectId;

  // remember_token             String?   @db.VarChar(100)
  // subscription_expired_at    DateTime? @db.Date
  // current_plan_id            BigInt?   @db.UnsignedBigInt
  // meta_data                  Json?
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
