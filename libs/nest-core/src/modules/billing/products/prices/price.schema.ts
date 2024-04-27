import { Price, StripePrice, SubscriptionPeriod } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { BaseDatabaseModel } from '../../../../lib/mongodb'

export type PriceDocument<T extends keyof Price = never> = mongoose.HydratedDocument<PriceModel<T>>

@Schema({ timestamps: true, autoIndex: true, collection: 'prices' })
export class PriceModel<T> extends BaseDatabaseModel implements Price {
	_id: string

	@Prop({ required: true, type: Number })
	price: number

	@Prop({ required: true, type: String, enum: SubscriptionPeriod })
	period: SubscriptionPeriod

	@Prop({ required: true, type: Boolean })
	default: boolean

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'products' })
	productId: string

	@Prop({ required: true, type: Object })
	stripe: StripePrice

	@Prop({ required: true, type: String })
	currencyCode: string

	@Prop({ required: true, type: Number })
	priority: number

	@Prop({ required: true, type: Boolean })
	visible: boolean
}

export const PriceSchema = SchemaFactory.createForClass(PriceModel)

export const PriceModelFactory: AsyncModelFactory = {
	name: PriceModel.name,
	imports: [],
	useFactory: () => {
		const schema = PriceSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
