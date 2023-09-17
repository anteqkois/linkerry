import { Flow, FlowStatus, Id } from '@market-connector/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { FlowVersionModel, FlowVersionSchema } from '../../flow-versions/schemas/flow-version.schema'
import { UserModel } from '../../users'

export type FlowDocument = mongoose.HydratedDocument<Flow>

@Schema({ timestamps: true, autoIndex: true })
export class FlowModel implements Flow {
  _id: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: UserModel.name })
  user: Id

  @Prop({ required: true, type: String, enum: FlowStatus, default: FlowStatus.Unpublished })
  status: FlowStatus

  @Prop({ required: true, type: FlowVersionSchema })
  version: FlowVersionModel
}

export const FlowSchema = SchemaFactory.createForClass(FlowModel)

export const FlowModelFactory: AsyncModelFactory = {
  name: FlowModel.name,
  imports: [],
  useFactory: () => {
    const schema = FlowSchema
    schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema
  },
  inject: [],
}
