import { Id, SubscriptionHistory } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { TimestampDatabaseModel } from '../../../../lib/mongodb'

export type SubscriptionHistoryDocument<T extends keyof SubscriptionHistory = never> = mongoose.HydratedDocument<SubscriptionHistoryModel<T>>

@Schema({ timestamps: true, autoIndex: true, collection: 'subscription-history' })
export class SubscriptionHistoryModel<T> extends TimestampDatabaseModel implements SubscriptionHistory {
	_id: string

	@Prop({ required: true, type: String })
	name: string

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'subscriptions' })
	subscriptionId: string

	@Prop({
		required: true,
		type: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'products',
		},
	})
	products: Id[]

	@Prop({ required: true, type: String })
	startedAt: string

	@Prop({ required: true, type: String })
	endedAt?: string
}

export const SubscriptionHistorySchema = SchemaFactory.createForClass(SubscriptionHistoryModel)

export const SubscriptionHistoryModelFactory: AsyncModelFactory = {
	name: SubscriptionHistoryModel.name,
	imports: [],
	useFactory: () => {
		const schema = SubscriptionHistorySchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
