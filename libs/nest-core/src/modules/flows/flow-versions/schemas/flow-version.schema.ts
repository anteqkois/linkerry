import { ActionConnector, FlowVersion, FlowVersionState, Id, TriggerConnector, TriggerEmpty, TriggerWebhook } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type FlowVersionDocument = mongoose.HydratedDocument<FlowVersion>

@Schema({ timestamps: true, autoIndex: true, collection: 'flow_versions', minimize: false })
export class FlowVersionModel implements FlowVersion {
  _id: Id

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'flow' })
  flow: Id

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'projects' })
  projectId: Id

  @Prop({ required: true, type: String })
  displayName: string

  @Prop({ required: true, type: Number })
  stepsCount: number

  @Prop({ required: true, type: Boolean })
  valid: boolean

  @Prop({ required: true, type: String, enum: FlowVersionState, default: FlowVersionState.DRAFT })
  state: FlowVersionState

	// todo discriminatorKey don't work
  @Prop({ required: true, type: [Object] })
  triggers: (TriggerEmpty | TriggerConnector |  TriggerWebhook)[]

	// todo discriminatorKey don't work
  @Prop({ required: true, type: [Object]})
  actions: ActionConnector[]
}

export const FlowVersionSchema = SchemaFactory.createForClass(FlowVersionModel)

export const flowVersionModelFactory: AsyncModelFactory = {
  name: FlowVersionModel.name,
  imports: [],
  useFactory: () => {
    const schema = FlowVersionSchema
    schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema
  },
  inject: [],
}
