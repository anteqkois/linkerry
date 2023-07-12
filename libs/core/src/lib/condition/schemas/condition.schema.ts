import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ConditionOperatorType, ConditionTypeType } from '../types';

export type ConditionDocument = mongoose.HydratedDocument<Condition>;

@Schema({ timestamps: true, versionKey: true })
export class Condition {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Customer' })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true, type: String })
  name: string;

  @Prop({ required: true, type: String, enum: ConditionTypeType })
  type: ConditionTypeType;

  @Prop({ required: true, type: Number, })
  requiredValue: number;

  @Prop({ required: true, type: String, enum: ConditionOperatorType })
  operator: ConditionOperatorType;

  @Prop({ required: true, type: Boolean, default: false })
  active: boolean;

  // Howe long event from this condition should be valid
  @Prop({ required: false, type: Number, default: 86400 }) // 1 day in seconds
  eventValidityUnix: number;

  // TODO It should be field from ticker collection
  @Prop({ required: false, type: String })
  ticker: string

  // TODO fields for future usage
  // @Prop({ required: false, type: Number})
  // expiredAtUnix: number

  // @Prop({ required: false, type: Boolean})
  // required: boolean
}

export const ConditionSchema = SchemaFactory.createForClass(Condition);
ConditionSchema.index({ userId: 1, name: 1 }, { unique: true, });


// Model factory
// export const conditionModelFactory: AsyncModelFactory = {
//   name: Condition.name,
//   imports: [EmitterModule],
//   useFactory: (emitter: EmitterService) => {
//     const schema = ConditionSchema;
//     return schema;
//   },
//   inject: [EmitterService],
// };
