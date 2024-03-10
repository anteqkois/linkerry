import { WebhookSimulation } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { TimestampDatabaseModel } from '../../../../lib/mongodb'

export type WebhookSimulationDocument = mongoose.HydratedDocument<WebhookSimulationModel>

@Schema({ timestamps: true, collection: 'webhook-simulations' })
export class WebhookSimulationModel extends TimestampDatabaseModel implements WebhookSimulation {
	_id: string

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'flows' })
	flowId: string

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'projects' })
	projectId: string
}

export const WebhookSimulationSchema = SchemaFactory.createForClass(WebhookSimulationModel)

export const WebhookSimulationModelFactory: AsyncModelFactory = {
	name: WebhookSimulationModel.name,
	imports: [],
	useFactory: () => {
		const schema = WebhookSimulationSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
