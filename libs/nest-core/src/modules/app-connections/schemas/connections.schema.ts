import { AppConnectionEncrypted, AppConnectionStatus, AppConnectionType, EncryptedObject, Id } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { BaseDatabaseModel } from '../../../lib/mongodb'
import { ProjectModel } from '../../projects/schemas/projects.schema'

export type AppConnectionsDocument = mongoose.HydratedDocument<AppConnectionEncrypted>

@Schema({ timestamps: true, autoIndex: true, collection: 'app_connections' })
export class AppConnectionsModel extends BaseDatabaseModel implements AppConnectionEncrypted {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: ProjectModel.name })
  projectId: Id

  @Prop({ required: true, type: String })
  connectorName: string

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true, type: String, enum: AppConnectionStatus })
  status: AppConnectionStatus

  @Prop({ required: true, type: String, enum: AppConnectionType })
  type: AppConnectionType

  @Prop({
    required: true,
    type: {
      iv: {
        type: String,
      },
      data: {
        type: String,
      },
    },
    _id: false,
  })
  value: EncryptedObject
}

export const AppConnectionsSchema = SchemaFactory.createForClass(AppConnectionsModel)

export const AppConnectionsModelFactory: AsyncModelFactory = {
  name: AppConnectionsModel.name,
  imports: [],
  useFactory: () => {
    const schema = AppConnectionsSchema
    schema.plugin(mongooseUniqueValidator, { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema
  },
  inject: [],
}
