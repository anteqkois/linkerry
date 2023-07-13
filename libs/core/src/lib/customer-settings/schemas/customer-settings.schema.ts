import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CustomerDocument = HydratedDocument<CustomerSetting>;

@Schema({ timestamps: true,})
export class CustomerSetting {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Customer' })
  customerId: Types.ObjectId;
}

export const CustomerSchema = SchemaFactory.createForClass(CustomerSetting);
