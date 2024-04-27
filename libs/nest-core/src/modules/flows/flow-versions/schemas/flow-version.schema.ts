import { ActionConnector, Flow, FlowVersion, FlowVersionState, TriggerConnector, TriggerEmpty } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { BaseDatabaseModel, IdObjectOrPopulated, ObjectId } from '../../../../lib/mongodb'

export type FlowVersionDocument<T extends keyof FlowVersion = never> = mongoose.HydratedDocument<FlowVersionModel<T>>

@Schema({ timestamps: true, autoIndex: true, collection: 'flow_versions', minimize: false })
export class FlowVersionModel<T> extends BaseDatabaseModel implements Omit<FlowVersion, '_id' | 'flow' | 'projectId' | 'updatedBy'> {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'flow' })
	flow: IdObjectOrPopulated<T, 'projectId', Flow>

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'projects' })
	projectId: ObjectId

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'users' })
	updatedBy: ObjectId

	@Prop({ required: true, type: String })
	displayName: string

	@Prop({ required: true, type: Number })
	stepsCount: number

	@Prop({ required: true, type: Boolean })
	valid: boolean

	@Prop({ required: true, type: String, enum: FlowVersionState, default: FlowVersionState.DRAFT })
	state: FlowVersionState

	// todo discriminatorKey don't work
	@Prop({ required: true, type: [Object] })
	triggers: (TriggerEmpty | TriggerConnector)[]

	// todo discriminatorKey don't work
	@Prop({ required: true, type: [Object] })
	actions: ActionConnector[]
}

export const FlowVersionSchema = SchemaFactory.createForClass(FlowVersionModel)

export const flowVersionModelFactory: AsyncModelFactory = {
	name: FlowVersionModel.name,
	imports: [],
	useFactory: () => {
		const schema = FlowVersionSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
