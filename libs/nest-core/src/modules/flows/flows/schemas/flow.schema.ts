import { Flow, FlowStatus, FlowVersion, Id } from '@market-connector/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { UserModel } from '../../../users'
import { FlowVersionModel } from '../../flow-versions/schemas/flow-version.schema'

export type FlowDocument = mongoose.HydratedDocument<Flow>

@Schema({ timestamps: true, autoIndex: true, collection: 'flows' })
export class FlowModel implements Flow {
  _id: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: UserModel.name })
  user: Id

  @Prop({ required: true, type: String, enum: FlowStatus, default: FlowStatus.Unpublished })
  status: FlowStatus

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: FlowVersionModel.name })
  version: FlowVersion
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
