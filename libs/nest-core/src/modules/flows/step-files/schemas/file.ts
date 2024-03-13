import { Id, StepFile } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { TimestampDatabaseModel } from '../../../../lib/mongodb'
import { ProjectsModel } from '../../../projects/schemas/projects.schema'
import { FlowModel } from '../../flows/schemas/flow.schema'

export type StepFileDocument = mongoose.HydratedDocument<StepFileModel>

@Schema({ timestamps: true, autoIndex: true, collection: 'step-files' })
export class StepFileModel extends TimestampDatabaseModel implements Omit<StepFile, '_id'> {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: FlowModel.name })
	flowId: Id

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: ProjectsModel.name })
	projectId: Id

	@Prop({ required: true, type: String })
	sourceName: string

	@Prop({ required: false, type: Object })
	payload?: any
}

export const StepFileSchema = SchemaFactory.createForClass(StepFileModel)

export const StepFileModelFactory: AsyncModelFactory = {
	name: StepFileModel.name,
	imports: [],
	useFactory: () => {
		const schema = StepFileSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
