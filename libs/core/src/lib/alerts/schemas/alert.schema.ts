import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AlertProvidersType } from '../models';
import {  AlertTradinView, AlertTradinViewSchema } from '../trading-view/trading-view.schema';

export type AlertDocument = mongoose.HydratedDocument<Alert>;

@Schema({ timestamps: true, discriminatorKey: "kind", })
export class Alert {
  _id: string;
  kind: string;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Conditions', index: 1 })
  conditionId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Boolean })
  active: boolean;

  @Prop({ required: false, type: Number, default: 86400 }) // 1 day in seconds
  alertValidityUnix: number;

  @Prop({ required: true, type: String, enum: AlertProvidersType })
  alertProvider: AlertProvidersType;

  @Prop({ required: true, type: Boolean, default: false })
  testMode: boolean

  @Prop({ required: true, type: String })
  alertHandlerUrl: String
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
AlertSchema.index({ userId: 1, name: 1 }, { unique: true, });

export const alertModelFactory: AsyncModelFactory = {
  name: Alert.name,
  imports: [],
  useFactory: () => {
    const schema = AlertSchema;
    schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema;
  },
  inject: [],
};
