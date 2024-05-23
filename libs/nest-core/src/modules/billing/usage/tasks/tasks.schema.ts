import { Id, TasksUsage } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { BaseDatabaseModel } from '../../../../lib/mongodb'

export type TasksUsageDocument<T extends keyof TasksUsage = never> = mongoose.HydratedDocument<TasksUsageModel<T>>

@Schema({ timestamps: true, autoIndex: true, collection: 'tasks_usage' })
export class TasksUsageModel<T> extends BaseDatabaseModel implements TasksUsage {
  _id: string

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'projects' })
  projectId: Id

  @Prop({ required: true, type: Number })
  tasks: number
}

export const TasksUsageSchema = SchemaFactory.createForClass(TasksUsageModel)

export const TasksUsageModelFactory: AsyncModelFactory = {
  name: TasksUsageModel.name,
  imports: [],
  useFactory: () => {
    const schema = TasksUsageSchema
    schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema
  },
  inject: [],
}
