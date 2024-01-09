import { Id, StepFile } from '@market-connector/shared'
import { AsyncModelFactory, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'

export type FileDocument = mongoose.HydratedDocument<File>

@Schema({ timestamps: true, autoIndex: true, collection: 'flows' })
export class FileModel implements StepFile {
	_id: string
	data: any
	flowId: Id
	name: string
	size: number
	stepName: string
	createdAt?: Date | undefined
	updatedAt?: Date | undefined
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
