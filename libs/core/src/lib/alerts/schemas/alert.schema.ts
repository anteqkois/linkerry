import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaTypes } from 'mongoose';
import { AlertProvidersType } from '../types';

export type AlertDocument = HydratedDocument<Alert>;

@Schema({ timestamps: true, versionKey: true })
export class Alert {
  @Prop({ required: true, type: SchemaTypes.Types.ObjectId, ref: 'Conditions', index: 1 })
  conditionId: SchemaTypes.Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: false, type: Number, default: 86400 }) // 1 day in seconds
  alertValidityUnix: number;

  @Prop({ required: true, type: AlertProvidersType })
  alertProvider: AlertProvidersType;

  // TODO It should be field from ticker collection
  @Prop({ required: false, type: String })
  ticker: string
}

export const AlertSchema = SchemaFactory.createForClass(Alert);

// id                         BigInt    @id @default(autoincrement()) @db.UnsignedBigInt
// group_id                   BigInt    @default(1) @db.UnsignedBigInt
// name                       String    @db.VarChar(255)
// phone                      String?   @db.VarChar(20)
// telegram_id                String?   @db.VarChar(100)
// telegram_bot_connected     Boolean?  @default(false)
// youtube_channel            String?   @db.VarChar(100)
// twitter_username           String?   @db.VarChar(100)
// email                      String    @unique(map: "customers_email_unique") @db.VarChar(255)
// email_verified_at          DateTime? @db.Timestamp(0)
// password                   String    @default("") @db.VarChar(255)
// remember_token             String?   @db.VarChar(100)
// subscription_expired_at    DateTime? @db.Date
// trial_expired_at           DateTime? @db.Timestamp(0)
// trial_duration             Int?
// current_plan_id            BigInt?   @db.UnsignedBigInt
// lifetime_plan_id           BigInt?   @db.UnsignedBigInt
// twitter_pro_expired_at     DateTime? @db.Timestamp(0)
// meta_data                  Json?
// settings                   Json?
// consents                   Json?
// deleted_at                 DateTime? @db.Timestamp(0)
// created_at                 DateTime? @db.Timestamp(0)
// trial_started_at           DateTime? @db.Timestamp(0)
// updated_at                 DateTime? @db.Timestamp(0)
// tokens                     String?   @default("0") @db.VarChar(100)
// buy_the_dip                DateTime? @db.Date
// wallet                     String?   @unique(map: "customers_wallet_unique") @db.VarChar(100)
// bonus_usd                  Float?
// bonus_percent              Float?
// quiz_completed_at          DateTime? @db.DateTime(0)
// temporary_plan_id          BigInt?   @db.UnsignedBigInt
// temporary_expired_at       DateTime? @db.DateTime(0)
// level1_affiliation_percent Float?
// level2_affiliation_percent Float?
// language
