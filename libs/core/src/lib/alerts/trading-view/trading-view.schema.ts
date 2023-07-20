import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AlertProvidersType } from '../models';
import { Alert } from '../schemas/alert.schema';

export type AlertTradinViewDocument = mongoose.HydratedDocument<AlertTradinView>;

@Schema()
export class AlertTradinView extends Alert {
  @Prop({ required: true, type: String, enum: AlertProvidersType, default: AlertProvidersType.TRADING_VIEW })
  override alertProvider: AlertProvidersType.TRADING_VIEW;

  @Prop({ required: false, type: String })
  symbol?: string

  @Prop({ required: false, type: String })
  messagePattern?: string
}

export const AlertTradinViewSchema = SchemaFactory.createForClass(AlertTradinView);
AlertTradinViewSchema.index({ userId: 1, name: 1 }, { unique: true, });

export const alertTradinViewModelFactory: AsyncModelFactory = {
  name: AlertTradinView.name,
  imports: [],
  useFactory: () => {
    const schema = AlertTradinViewSchema;
    schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema;
  },
  inject: [],
};

