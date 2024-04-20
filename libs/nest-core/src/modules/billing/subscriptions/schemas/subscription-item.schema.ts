import { SubscriptionItem } from '@linkerry/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { IdObjectOrPopulated } from '../../../../lib/mongodb'
import { PriceDocument, PriceModel } from '../../products/prices/price.schema'
import { ProductDocument, ProductModel } from '../../products/product.schema'

export type SubscriptionItemDocument<T extends keyof SubscriptionItem = never> = mongoose.HydratedDocument<SubscriptionItemModel<T>>

@Schema({ _id: false })
export class SubscriptionItemModel<T> implements Omit<SubscriptionItem, 'price' | 'product'> {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: PriceModel.name })
	price: IdObjectOrPopulated<T, 'price', PriceDocument>

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: ProductModel.name })
	product: IdObjectOrPopulated<T, 'product', ProductDocument>
}
export const SubscriptionItemSchema = SchemaFactory.createForClass(SubscriptionItemModel)
