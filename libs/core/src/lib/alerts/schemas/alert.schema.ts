import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AlertProvidersType } from '../types';

export type AlertDocument = HydratedDocument<Alert>;

@Schema({ timestamps: true, versionKey: true })
export class Alert {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Conditions', index: 1 })
  conditionId: Types.ObjectId;

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
