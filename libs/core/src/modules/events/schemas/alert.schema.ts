import { EventObjectType, IBaseEvent } from '@market-connector/types';
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type EventDocument = mongoose.HydratedDocument<Event>;

@Schema({ timestamps: true, })
export class Event  implements IBaseEvent{
  _id: string;

  @Prop({ required: true, type: String })
  event_id: string;

  @Prop({ required: true, type: String, enum: EventObjectType })
  object: EventObjectType;

  @Prop({ required: true, type: Object })
  data: Object;
}

export const EventSchema = SchemaFactory.createForClass(Event);

export const EventModelFactory: AsyncModelFactory = {
  name: Event.name,
  imports: [],
  useFactory: () => {
    const schema = EventSchema;
    // schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema;
  },
  inject: [],
};
