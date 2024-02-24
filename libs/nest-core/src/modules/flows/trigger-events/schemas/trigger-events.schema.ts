import { Id, TriggerEvent } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { ProjectsModel } from '../../../projects/schemas/projects.schema'
import { FlowModel } from '../../flows/schemas/flow.schema'

export type TriggerEventDocument = mongoose.HydratedDocument<TriggerEvent>

@Schema({ timestamps: true, autoIndex: true, collection: 'trigger-events' })
export class TriggerEventModel implements TriggerEvent {
	_id: string

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: FlowModel.name })
	flowId: Id

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: ProjectsModel.name })
	projectId: Id

	@Prop({ required: true, type: Object })
	payload: any

	@Prop({ required: true, type: String })
	sourceName: string
}

export const TriggerEventSchema = SchemaFactory.createForClass(TriggerEventModel)

export const TriggerEventModelFactory: AsyncModelFactory = {
	name: TriggerEventModel.name,
	imports: [],
	useFactory: () => {
		const schema = TriggerEventSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
