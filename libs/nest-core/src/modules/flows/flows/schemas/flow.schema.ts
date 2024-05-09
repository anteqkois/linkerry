import { Flow, FlowScheduleOptions, FlowStatus, FlowVersion, Nullable, TypeOrDefaultType } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { BaseDatabaseModel, ObjectId } from '../../../../lib/mongodb'
import { ProjectModel } from '../../../projects/schemas/projects.schema'
import { FlowVersionModel } from '../../flow-versions/schemas/flow-version.schema'

export type FlowDocument<T extends keyof Flow = never> = mongoose.HydratedDocument<FlowModel<T>>

@Schema({
  timestamps: true,
  autoIndex: true,
  collection: 'flows',
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class FlowModel<T = ''>
  extends BaseDatabaseModel
  implements Omit<Flow, '_id' | 'flowVersionId' | 'version' | 'projectId' | 'publishedVersionId'>
{
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: ProjectModel.name })
  projectId: ObjectId

  @Prop({ required: true, type: String, enum: FlowStatus, default: FlowStatus.DISABLED })
  status: FlowStatus

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: FlowVersionModel.name })
  flowVersionId: ObjectId

  version: TypeOrDefaultType<T, 'version', FlowVersion, undefined>

  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, default: null })
  publishedVersionId: Nullable<ObjectId>

  @Prop({ required: false, type: Object, default: null })
  schedule: Nullable<FlowScheduleOptions>

  @Prop({ required: false, type: Object, default: false })
  deleted: boolean
}

export const FlowSchema = SchemaFactory.createForClass(FlowModel)

FlowSchema.virtual('version', {
  localField: 'flowVersionId',
  ref: FlowVersionModel.name,
  foreignField: '_id',
  justOne: true,
})

export const FlowModelFactory: AsyncModelFactory = {
  name: FlowModel.name,
  imports: [],
  useFactory: () => {
    const schema = FlowSchema
    schema.plugin(mongooseUniqueValidator, { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema
  },
  inject: [],
}
