import { Common, PaymentGateway, Product, Subscription, SubscriptionPeriod, SubscriptionStatus } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { IdObjectOrPopulated, TimestampDatabaseModel } from '../../../../lib/mongodb'
import { ProductModel } from '../../products/product.schema'

export type SubscriptionDocument<T extends keyof Subscription = never> = mongoose.HydratedDocument<SubscriptionModel<T>>

@Schema({ timestamps: true, autoIndex: true, collection: 'subscriptions' })
export class SubscriptionModel<T> extends TimestampDatabaseModel implements Omit<Common<Subscription>, 'products'> {
	_id: string

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'projects' })
	projectId: string

	@Prop({ required: true, type: String, enum: PaymentGateway })
	paymentGateway: PaymentGateway

	@Prop({
		type: [
			{
				type: mongoose.Types.ObjectId,
				ref: ProductModel.name,
			},
		],
	})
	products: IdObjectOrPopulated<T, 'products', Product[]>

	@Prop({ required: true, type: String, enum: SubscriptionStatus })
	status: SubscriptionStatus

	@Prop({ required: true, type: String })
	period: SubscriptionPeriod

	@Prop({ required: false, type: String })
	stripeSubscriptionId?: string

	@Prop({ required: false, type: String })
	trialStartedAt?: string

	@Prop({ required: false, type: String })
	trialEndedAt?: string

	@Prop({ required: false, type: String })
	validTo: string

	@Prop({ required: false, type: String })
	currentPeriodEnd: string

	@Prop({ required: false, type: String })
	canceledAt?: string

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
