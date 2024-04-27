import { PlanProductConfiguration, Product, ProductType, StripeProduct } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { BaseDatabaseModel } from '../../../lib/mongodb'

export type ProductDocument<T extends keyof Product = never> = mongoose.HydratedDocument<ProductModel<T>>

@Schema({ timestamps: true, autoIndex: true, collection: 'products' })
export class ProductModel<T> extends BaseDatabaseModel implements Product {
	_id: string

	@Prop({ required: true, type: String })
	name: string

	@Prop({ required: true, type: String })
	shortDescription: string

	@Prop({ required: true, type: String, enum: ProductType })
	type: ProductType

	@Prop({ required: true, type: Object })
	config: PlanProductConfiguration

	@Prop({ required: true, type: Number })
	priority: number

	@Prop({ required: true, type: Boolean })
	visible: boolean

	@Prop({ required: true, type: Object })
	stripe: StripeProduct
}

export const ProductSchema = SchemaFactory.createForClass(ProductModel)

export const ProductModelFactory: AsyncModelFactory = {
	name: ProductModel.name,
	imports: [],
	useFactory: () => {
		const schema = ProductSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
