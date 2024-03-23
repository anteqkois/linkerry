import { Flow, FlowScheduleOptions, FlowStatus, FlowVersion, Nullable } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { IdObjectOrPopulated, ObjectId, TimestampDatabaseModel } from '../../../../lib/mongodb'
import { ProjectsModel } from '../../../projects/schemas/projects.schema'
import { FlowVersionModel } from '../../flow-versions/schemas/flow-version.schema'

export type FlowDocument<T extends keyof Flow = never> = mongoose.HydratedDocument<FlowModel<T>>

@Schema({ timestamps: true, autoIndex: true, collection: 'flows' })
export class FlowModel<T> extends TimestampDatabaseModel implements Omit<Flow, '_id' | 'version' | 'projectId' | 'publishedVersionId'> {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: ProjectsModel.name })
	projectId: ObjectId

	@Prop({ required: true, type: String, enum: FlowStatus, default: FlowStatus.DISABLED })
	status: FlowStatus

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: FlowVersionModel.name })
	version: IdObjectOrPopulated<T, 'version', FlowVersion>

	@Prop({ required: false, type: mongoose.Schema.Types.ObjectId, default: null })
	publishedVersionId: Nullable<ObjectId>

	@Prop({ required: false, type: Object, default: null })
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
