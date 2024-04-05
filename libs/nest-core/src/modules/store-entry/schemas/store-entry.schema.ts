import { StoreEntry } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { TimestampDatabaseModel } from '../../../lib/mongodb'

export type StoreEntryDocument = mongoose.HydratedDocument<StoreEntryModel>

@Schema({ timestamps: true, collection: 'store_entries' })
export class StoreEntryModel extends TimestampDatabaseModel implements StoreEntry {
	_id: string

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'projects' })
	projectId: string

	@Prop({ required: true, type: String })
	key: string

	@Prop({ required: true, type: mongoose.Schema.Types.Mixed })
	value: unknown
}

export const StoreEntrySchema = SchemaFactory.createForClass(StoreEntryModel)

export const StoreEntryModelFactory: AsyncModelFactory = {
	name: StoreEntryModel.name,
	imports: [],
	useFactory: () => {
		const schema = StoreEntrySchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}

