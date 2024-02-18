import { ActionBase, ConnectorAuthProperty, ConnectorMetadata, ConnectorTag, TriggerBase, connectorTag } from '@linkerry/connectors-framework'
import { ConnectorGroup, ConnectorType } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type ConnectorsMetadataDocument = mongoose.HydratedDocument<ConnectorMetadata>

@Schema({ timestamps: true, autoIndex: true, collection: 'connectors_metadata' })
export class ConnectorsMetadataModel implements ConnectorMetadata {
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

	@Prop({ required: true, type: [{ type: String, enum: connectorTag }] })
	tags: ConnectorTag[]

	@Prop({ required: true, type: String, enum: ConnectorGroup })
	group: ConnectorGroup

	@Prop({ required: true, type: String, enum: ConnectorType })
	connectorType: ConnectorType
}

export const ConnectorsMetadataSchema = SchemaFactory.createForClass(ConnectorsMetadataModel)
ConnectorsMetadataSchema.index({ name: 1, version: 1 }, { unique: true, sparse: true })

export const ConnectorsMetadataModelFactory: AsyncModelFactory = {
	name: ConnectorsMetadataModel.name,
	imports: [],
	useFactory: () => {
		const schema = ConnectorsMetadataSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
