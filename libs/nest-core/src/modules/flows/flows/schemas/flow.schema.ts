import { Flow, FlowScheduleOptions, FlowStatus, FlowVersion, Id, Nullable } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { ProjectsModel } from '../../../projects/schemas/projects.schema'
import { FlowVersionModel } from '../../flow-versions/schemas/flow-version.schema'

export type FlowDocument = mongoose.HydratedDocument<Flow>

@Schema({ timestamps: true, autoIndex: true, collection: 'flows' })
export class FlowModel implements Flow {
	_id: string

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: ProjectsModel.name })
	projectId: Id

	@Prop({ required: true, type: String, enum: FlowStatus, default: FlowStatus.DISABLED })
	status: FlowStatus

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: FlowVersionModel.name })
	version: FlowVersion | Id

	@Prop({ required: false, type: mongoose.Schema.Types.ObjectId, default: null })
	publishedVersionId: Nullable<Id>

	@Prop({ required: false, type: Object, default: null})
	schedule: Nullable<FlowScheduleOptions>
}

export const FlowSchema = SchemaFactory.createForClass(FlowModel)

export const FlowModelFactory: AsyncModelFactory = {
	name: FlowModel.name,
	imports: [],
	useFactory: () => {
		const schema = FlowSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
