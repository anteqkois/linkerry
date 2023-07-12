import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as SchemaTypes } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ timestamps: true, versionKey: true })
export class Customer {
  @Prop({ required: true, type: String })
  name: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
