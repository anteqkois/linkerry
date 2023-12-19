// import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
// import mongoose from 'mongoose'

// export type EventDocument = mongoose.HydratedDocument<Event>

// @Schema({ timestamps: true })
// export class Event implements IBaseEvent {
//   _id: string

//   @Prop({ required: true, type: String })
//   id: string

//   @Prop({ required: true, type: Number })
//   createdUnix: number

//   @Prop({ required: true, type: String, enum: EventType })
//   type: EventType

//   @Prop({ required: true, type: String, enum: EventType })
//   @Prop({ required: true, type: Object })
//   data: { object: EventObject }
// }

// export const EventSchema = SchemaFactory.createForClass(Event)

// export const EventModelFactory: AsyncModelFactory = {
//   name: Event.name,
//   imports: [],
//   useFactory: () => {
//     const schema = EventSchema
//     // schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
//     return schema
//   },
//   inject: [],
// }
