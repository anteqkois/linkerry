import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AlertDocument = HydratedDocument<Alert>;

@Schema({ timestamps: true, versionKey: true})
export class Alert {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  breed: string;
}

export const AlertSchema = SchemaFactory.createForClass(Alert);
