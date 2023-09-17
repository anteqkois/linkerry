import { FlowState, FlowVersion, Id } from '@market-connector/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { FlowModel } from '../../flows/schemas/flow.schema'
import { StepTriggerModel, StepTriggerSchema } from './step.schema'

export type FlowVersionDocument = mongoose.HydratedDocument<FlowVersion>

@Schema({ timestamps: true, autoIndex: true })
export class FlowVersionModel implements FlowVersion {
  _id: string

  @Prop({ required: true, type: String })
  displayName: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: FlowModel.name })
  flow: Id

  @Prop({ required: true, type: Boolean })
  valid: boolean

  @Prop({ required: true, type: String, enum: FlowState, default: FlowState.Draft })
  state: FlowState

  @Prop({ required: true, type: StepTriggerSchema })
  triggers: StepTriggerModel[]
}

export const FlowVersionSchema = SchemaFactory.createForClass(FlowVersionModel)

export const flowVersionFactory: AsyncModelFactory = {
  name: FlowVersionModel.name,
  imports: [],
  useFactory: () => {
    const schema = FlowVersionSchema
    schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema
  },
  inject: [],
}
