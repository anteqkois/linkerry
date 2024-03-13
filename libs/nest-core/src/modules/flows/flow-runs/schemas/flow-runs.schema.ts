import { Flow, FlowRun, FlowRunStatus, PauseMetadata, Project, RunEnvironment, RunTerminationReason } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { IdObjectOrPopulated, TimestampDatabaseModel } from '../../../../lib/mongodb'
import { ProjectsModel } from '../../../projects/schemas/projects.schema'
import { FlowVersionModel } from '../../flow-versions/schemas/flow-version.schema'
import { FlowModel } from '../../flows/schemas/flow.schema'

export type FlowRunDocument<T extends keyof FlowRun = never> = mongoose.HydratedDocument<FlowRunModel<T>>
export type FlowRunWithStepsDocument<T extends keyof FlowRun = never> = mongoose.HydratedDocument<FlowRunModel<T> & { steps: FlowRun }>

@Schema({ timestamps: true, autoIndex: true, collection: 'flow-runs' })
export class FlowRunModel<T> extends TimestampDatabaseModel implements Omit<FlowRun, '_id' | 'projectId' | 'flowId' | 'logsFileId' | 'steps'> {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: ProjectsModel.name })
	projectId: IdObjectOrPopulated<T, 'projectId', Project>

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: FlowModel.name })
	flowId: IdObjectOrPopulated<T, 'flowId', Flow>

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: FlowVersionModel.name })
	flowVersionId: string

	@Prop({ required: true, type: String })
	flowDisplayName: string

	@Prop({ required: false, type: Object })
	terminationReason?: RunTerminationReason | undefined

	@Prop({ required: false, type: String })
	logsFileId: NonNullable<IdObjectOrPopulated<T, 'flowId', Flow>>

	@Prop({ required: false, type: Number })
	tasks?: number | undefined

	@Prop({ required: true, type: String, enum: FlowRunStatus })
	status: FlowRunStatus

	@Prop({ required: true, type: Date })
	startTime: string

	@Prop({ required: false, type: Date })
	finishTime: string

	@Prop({ required: false, type: Object })
	pauseMetadata?: PauseMetadata | undefined

	// this field is 'virtual', it is added retriving file from other collection if neccesery
	// @Prop({ required: false, type: Object })
	// steps: Record<string, StepOutput>

	@Prop({ required: true, type: String, enum: RunEnvironment })
	environment: RunEnvironment
}

export const FlowRunSchema = SchemaFactory.createForClass(FlowRunModel)

export const FlowRunModelFactory: AsyncModelFactory = {
	name: FlowRunModel.name,
	imports: [],
	useFactory: () => {
		const schema = FlowRunSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
