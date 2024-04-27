import { EncryptedObject, OAuth2AppEncrypted } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { BaseDatabaseModel } from '../../../../lib/mongodb'

export type AppsDocument = mongoose.HydratedDocument<AppsModel>

@Schema({ timestamps: true, autoIndex: true, collection: 'apps' })
export class AppsModel extends BaseDatabaseModel implements OAuth2AppEncrypted {
	_id: string

	@Prop({ required: true, type: String })
	connectorName: string

	@Prop({ required: true, type: String })
	clientId: string

	@Prop({ required: true, type: Object })
	clientSecret: EncryptedObject
}

export const AppsSchema = SchemaFactory.createForClass(AppsModel)

export const AppsModelFactory: AsyncModelFactory = {
	name: AppsModel.name,
	imports: [],
	useFactory: () => {
		const schema = AppsSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
