import { NotificationStatus, Project, TypeOrDefaultType } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { BaseDatabaseModel } from '../../../lib/mongodb'
import { UserDocument, UserModel } from '../../users/schemas/user.schema'

export type ProjectDocument<T extends keyof Project = never> = mongoose.HydratedDocument<ProjectModel<T>>

@Schema({ timestamps: true, autoIndex: true, collection: 'projects' })
export class ProjectModel<T = ''> extends BaseDatabaseModel implements Omit<Project, '_id' | 'ownerId' | 'owner' | 'userIds' | 'users'> {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: UserModel.name,
  })
  ownerId: mongoose.Types.ObjectId

  owner: TypeOrDefaultType<T, 'owner', UserDocument, undefined>

  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: UserModel.name,
  })
  userIds: mongoose.Types.ObjectId[]

  users: TypeOrDefaultType<T, 'owner', UserDocument[], undefined>

  @Prop({ required: true, type: String })
  displayName: string

  @Prop({ required: true, type: String, enum: NotificationStatus })
  notifyStatus: NotificationStatus
}

export const ProjectsSchema = SchemaFactory.createForClass(ProjectModel)
ProjectsSchema.virtual('owner', {
  localField: 'ownerId',
  ref: UserModel.name,
  foreignField: '_id',
  justOne: true,
})
ProjectsSchema.virtual('users', {
  localField: 'userIds',
  ref: UserModel.name,
  foreignField: '_id',
})

export const ProjectModelFactory: AsyncModelFactory = {
  name: ProjectModel.name,
  imports: [],
  useFactory: () => {
    const schema = ProjectsSchema
    schema.plugin(mongooseUniqueValidator, {
      message: 'Error, expected {PATH} to be unique. Received {VALUE}',
    })
    return schema
  },
  inject: [],
}
