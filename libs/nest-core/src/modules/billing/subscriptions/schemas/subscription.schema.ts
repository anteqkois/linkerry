import { Common, PaymentGateway, Subscription, SubscriptionPeriod, SubscriptionStatus, TypeOrDefaultType } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { BaseDatabaseModel } from '../../../../lib/mongodb'
import { ProjectDocument, ProjectModel } from '../../../projects/schemas/projects.schema'
import { SubscriptionItemDocument, SubscriptionItemSchema } from './subscription-item.schema'

export type SubscriptionDocument<T extends keyof Subscription = never> = mongoose.HydratedDocument<SubscriptionModel<T>>

@Schema({
  timestamps: true,
  autoIndex: true,
  collection: 'subscriptions',
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
})
export class SubscriptionModel<T> extends BaseDatabaseModel implements Omit<Common<Subscription>, 'items' | 'projectId' | 'project'> {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'projects',
  })
  projectId: mongoose.Types.ObjectId

  project: TypeOrDefaultType<T, 'owner', ProjectDocument, undefined>

  @Prop({ required: true, type: String, enum: PaymentGateway })
  paymentGateway: PaymentGateway

  @Prop({
    required: true,
    type: [SubscriptionItemSchema],
  })
  items: TypeOrDefaultType<
    T,
    'items',
    SubscriptionItemDocument<T extends 'items' ? 'price' | 'product' : never>[],
    {
      price: mongoose.Types.ObjectId
      product: mongoose.Types.ObjectId
    }[]
  >

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
  canceledAt?: string

  @Prop({ required: false, type: String })
  defaultPaymentMethod: null
}

export const SubscriptionSchema = SchemaFactory.createForClass(SubscriptionModel)

SubscriptionSchema.virtual('project', {
  localField: 'projectId',
  ref: ProjectModel.name,
  foreignField: '_id',
  justOne: true,
})

export const SubscriptionModelFactory: AsyncModelFactory = {
  name: SubscriptionModel.name,
  imports: [],
  useFactory: () => {
    const schema = SubscriptionSchema
    schema.plugin(mongooseUniqueValidator, {
      message: 'Error, expected {PATH} to be unique. Received {VALUE}',
    })
    return schema
  },
  inject: [],
}
