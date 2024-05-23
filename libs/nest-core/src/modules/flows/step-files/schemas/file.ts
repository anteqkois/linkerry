import { Id, StepFile } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { BaseDatabaseModel } from '../../../../lib/mongodb'
import { ProjectModel } from '../../../projects/schemas/projects.schema'
import { FlowModel } from '../../flows/schemas/flow.schema'

export type StepFileDocument = mongoose.HydratedDocument<StepFileModel>

@Schema({ timestamps: true, autoIndex: true, collection: 'step_files' })
export class StepFileModel extends BaseDatabaseModel implements Omit<StepFile, '_id'> {
  @Prop({ required: true, type: Object })
  data: any

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: FlowModel.name })
  flowId: Id

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: ProjectModel.name })
  projectId: Id

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true, type: Number })
  size: number

  @Prop({ required: true, type: String })
  stepName: string
}

export const StepFileSchema = SchemaFactory.createForClass(StepFileModel)

export const StepFileModelFactory: AsyncModelFactory = {
  name: StepFileModel.name,
  imports: [],
  useFactory: () => {
    const schema = StepFileSchema
    schema.plugin(mongooseUniqueValidator, { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema
  },
  inject: [],
}
