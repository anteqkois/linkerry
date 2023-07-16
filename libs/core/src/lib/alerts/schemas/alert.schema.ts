import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AlertProvidersType } from '../types';

export type AlertDocument = HydratedDocument<Alert>;

@Schema({ timestamps: true, })
export class Alert {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Users' })
  userId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Conditions', index: 1 })
  conditionId: Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: Boolean})
  active: boolean;

  @Prop({ required: false, type: Number, default: 86400 }) // 1 day in seconds
  alertValidityUnix: number;

  @Prop({ required: true, type: String, enum: AlertProvidersType })
  alertProvider: AlertProvidersType;

  // TODO It should be field from ticker collection
  @Prop({ required: false, type: String })
  ticker: string

  @Prop({ required: true, type: Boolean, default: false })
  testMode: boolean
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
AlertSchema.index({ userId: 1, name: 1 }, { unique: true, });

export const alertModelFactory: AsyncModelFactory = {
  name: Alert.name,
  imports: [],
  useFactory: () => {
    const schema = AlertSchema;
    // schema.plugin(require('mongoose-unique-validator'), { message: 'Email or nick exists' }); // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
    return schema;
  },
  inject: [],
};
