import { Common, Id, PaymentGateway, Subscription, SubscriptionPeriod, SubscriptionStatus } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { TimestampDatabaseModel } from '../../../../lib/mongodb'

export type SubscriptionDocument<T extends keyof Subscription = never> = mongoose.HydratedDocument<SubscriptionModel<T>>

@Schema({ timestamps: true, autoIndex: true, collection: 'subscription' })
export class SubscriptionModel<T> extends TimestampDatabaseModel implements Common<Subscription> {
	_id: string

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'projects' })
	projectId: string

	@Prop({ required: true, type: String, enum: PaymentGateway })
	paymentGateway: PaymentGateway

	@Prop({
		required: true,
		type: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'products',
		},
	})
	products: Id[]

	@Prop({ required: true, type: String, enum: SubscriptionStatus })
	subscriptionStatus: SubscriptionStatus

	@Prop({ required: true, type: String })
	period: SubscriptionPeriod

	@Prop({ required: false, type: String })
	stripeSubscriptionId?: string

	@Prop({ required: false, type: String, default: null })
	trialStartedAt: string | null

	@Prop({ required: false, type: String, default: null })
	trialEndedAt: string | null

	@Prop({ required: false, type: String, default: null })
	validTo: string | null

	@Prop({ required: false, type: String, default: null })
	currentPeriodEnd: string | null

	@Prop({ required: false, type: String, default: null })
	canceledAt: string | null

	@Prop({ required: false, type: String })
	defaultPaymentMethod: null
}

export const SubscriptionSchema = SchemaFactory.createForClass(SubscriptionModel)

export const SubscriptionModelFactory: AsyncModelFactory = {
	name: SubscriptionModel.name,
	imports: [],
	useFactory: () => {
		const schema = SubscriptionSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
