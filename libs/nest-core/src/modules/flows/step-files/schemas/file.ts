import { Id, StepFile } from '@linkerry/shared'
import { AsyncModelFactory, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { TimestampDatabaseModel } from '../../../../lib/mongodb'

export type FileDocument = mongoose.HydratedDocument<File>

@Schema({ timestamps: true, autoIndex: true, collection: 'flows' })
export class FileModel extends TimestampDatabaseModel implements StepFile {
	_id: string
	data: any
	flowId: Id
	name: string
	size: number
	stepName: string
}

export const FileSchema = SchemaFactory.createForClass(FileModel)

export const FileModelFactory: AsyncModelFactory = {
	name: FileModel.name,
	imports: [],
	useFactory: () => {
		const schema = FileSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
