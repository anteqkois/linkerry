import { ActionBase, ConnectorAuthProperty, ConnectorMetadata, TriggerBase } from '@market-connector/connectors-framework'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type ConnectorMetadataDocument = mongoose.HydratedDocument<ConnectorMetadata>

@Schema({ timestamps: true, autoIndex: true, collection: 'flows' })
export class ConnectorMetadataModel implements ConnectorMetadata {
  _id: string

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true, type: String })
  displayName: string

  @Prop({ required: true, type: String })
  description: string

  @Prop({ required: true, type: Object })
  actions: Record<string, ActionBase>

  @Prop({ required: true, type: Object })
  triggers: Record<string, TriggerBase>

  @Prop({ required: true, type: Object })
  auth?: ConnectorAuthProperty | undefined

  @Prop({ required: true, type: String })
  logoUrl: string

  @Prop({ required: true, type: String })
  maximumSupportedRelease: string

  @Prop({ required: true, type: String })
  minimumSupportedRelease: string

  @Prop({ required: true, type: String })
  version: string
}

export const ConnectorMetadataSchema = SchemaFactory.createForClass(ConnectorMetadataModel)
ConnectorMetadataSchema.index({ name: 1, version: 1 }, { unique: true, sparse: true })

export const ConnectorMetadataModelFactory: AsyncModelFactory = {
  name: ConnectorMetadataModel.name,
  imports: [],
  useFactory: () => {
    const schema = ConnectorMetadataSchema
    schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
    return schema
  },
  inject: [],
}
