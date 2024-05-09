import { SubscriptionItem, TypeOrDefaultType } from '@linkerry/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { PriceDocument, PriceModel } from '../../products/prices/price.schema'
import { ProductDocument, ProductModel } from '../../products/product.schema'

export type SubscriptionItemDocument<T extends keyof SubscriptionItem = never> = mongoose.HydratedDocument<SubscriptionItemModel<T>>

@Schema({
  _id: false,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class SubscriptionItemModel<T> implements Omit<SubscriptionItem, 'priceId' | 'productId'> {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: PriceModel.name,
  })
  priceId: mongoose.Types.ObjectId

  price?: TypeOrDefaultType<T, 'price', PriceDocument, undefined>

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: ProductModel.name,
  })
  productId: mongoose.Types.ObjectId

  product: TypeOrDefaultType<T, 'price', ProductDocument, undefined>
}

export const SubscriptionItemSchema = SchemaFactory.createForClass(SubscriptionItemModel)

SubscriptionItemSchema.virtual('price', {
  localField: 'priceId',
  ref: PriceModel.name,
  foreignField: '_id',
  justOne: true,
})
SubscriptionItemSchema.virtual('product', {
  localField: 'productId',
  ref: ProductModel.name,
  foreignField: '_id',
  justOne: true,
})
