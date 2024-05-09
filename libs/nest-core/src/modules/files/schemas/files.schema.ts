import { File, FileCompression, FileType, Project, TypeOrDefaultType } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { BaseDatabaseModel } from '../../../lib/mongodb'
import { ProjectModel } from '../../projects/schemas/projects.schema'

export type FileDocument<T extends keyof File = never> = mongoose.HydratedDocument<FileModel<T>>

@Schema({
  timestamps: true,
  autoIndex: true,
  collection: 'files',
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class FileModel<T> extends BaseDatabaseModel implements Omit<File, '_id' | 'projectId'> {
  @Prop({ required: false, type: mongoose.Schema.Types.ObjectId, ref: ProjectModel.name })
  projectId?: TypeOrDefaultType<T, 'projectId', Project, undefined>
  project?: Project

  // platformId?: string | undefined

  @Prop({ required: true, type: String, enum: FileType })
  type: FileType

  @Prop({ required: true, type: Buffer })
  data: Buffer

  @Prop({ required: true, type: String, enum: FileCompression })
  compression: FileCompression
}

export const FileSchema = SchemaFactory.createForClass(FileModel)

FileSchema.virtual('project', {
  localField: 'projectId',
  ref: ProjectModel.name,
  foreignField: '_id',
  justOne: true,
})

export const FileModelFactory: AsyncModelFactory = {
  name: FileModel.name,
  imports: [],
  useFactory: () => {
    const schema = FileSchema
    schema.plugin(mongooseUniqueValidator, { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema
  },
  inject: [],
}
