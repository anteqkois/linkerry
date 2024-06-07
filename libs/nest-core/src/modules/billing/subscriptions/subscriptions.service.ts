import {
  ChangeSubscriptionBody,
  ChangeSubscriptionCheckoutResponse,
  ChangeSubscriptionResponse,
  ChangeSubscriptionResponseType,
  CustomError,
  ErrorCode,
  Id,
  PaymentGateway,
  ProductType,
  Subscription,
  SubscriptionBlank,
  SubscriptionItem,
  SubscriptionPeriod,
  SubscriptionStatus,
  assertNotNullOrUndefined,
  isEmpty,
} from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import mongoose, { FilterQuery, Model } from 'mongoose'
import { EVENT } from '../../configs/events-emitter'
import { ProjectDocument, ProjectModel } from '../../projects/schemas/projects.schema'
import { PaymentItem, StripeService } from '../payments/stripe.service'
import { PriceDocument, PriceModel } from '../products/prices/price.schema'
import { ProductDocument, ProductModel } from '../products/product.schema'
import { SubscriptionPlanUpdate, SubscriptionUpdate } from './events'
import { SubscriptionDocument, SubscriptionModel } from './schemas/subscription.schema'

@Injectable()
export class SubscriptionsService {
  private readonly logger = new Logger(SubscriptionsService.name)
  private readonly DEFAULT_VALIDITY_DATE
  private readonly DEFAULT_SUBSCRIPTION_ID

  constructor(
    @InjectModel(SubscriptionModel.name) private readonly subscriptionModel: Model<SubscriptionDocument>,
    @InjectModel(ProductModel.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(PriceModel.name) private readonly priceModel: Model<PriceDocument>,
    @InjectModel(ProjectModel.name) private readonly projectModel: Model<ProjectDocument>,
    private readonly configService: ConfigService,
    private readonly stripeService: StripeService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.DEFAULT_VALIDITY_DATE = this.configService.getOrThrow('DEFAULT_VALIDITY_DATE')
    this.DEFAULT_SUBSCRIPTION_ID = this.configService.getOrThrow('DEFAULT_SUBSCRIPTION_ID')
  }

  private async _populatePaymentItems(items: ChangeSubscriptionBody['items']) {
    const paymentIems: PaymentItem[] = []

    for (const item of items) {
      const product = await this.productModel.findOne({
        _id: item.productId,
      })
      assertNotNullOrUndefined(product, 'product')
      const price = await this.priceModel.findOne({
        _id: item.priceId,
        productId: product.id,
      })
      assertNotNullOrUndefined(price, 'price')
      paymentIems.push({
        product: product.toObject(),
        price: price.toObject(),
      })
    }

    return paymentIems
  }

  private async _getDefaultSubscription(projectId: Id) {
    const defaultSubscription = await this.subscriptionModel
      .findOne<SubscriptionDocument<'items'>>({
        _id: '6616eea2381de823f1da2001',
      })
      .populate('items.price')
      .populate('items.product')
    assertNotNullOrUndefined(defaultSubscription, 'defaultSubscription')

    defaultSubscription.projectId = new mongoose.Types.ObjectId(projectId)
    return defaultSubscription
  }

  private async _createSubscriptionOrRetriveIncompleted({
    period,
    projectId,
    items,
  }: {
    period: SubscriptionPeriod
    projectId: Id
    items: SubscriptionItem[]
  }) {
    const incompletedSubscription = await this.subscriptionModel.findOne({
      status: SubscriptionStatus.INCOMPLETE,
      projectId,
      items: {
        $in: items,
      },
    })
    if (incompletedSubscription) return incompletedSubscription

    const nowDate = dayjs().toISOString()
    const input: Omit<SubscriptionBlank, '_id' | 'createdAt' | 'updatedAt'> = {
      paymentGateway: PaymentGateway.NONE,
      period,
      projectId,
      status: SubscriptionStatus.INCOMPLETE,
      validTo: nowDate,
      items,
    }
    const createdSubscription = await this.subscriptionModel.create(input)

    return createdSubscription
  }

  private async _createFirstPaidSubscription({ items, projectId, period }: CreateSubscriptionParams): Promise<ChangeSubscriptionCheckoutResponse> {
    // TODO use payment gateway architecture in future -> use paymentGateway.createSubscription() where in the background will be used the right gateway (stripe, crypto etc)
    // TODO? add to productModel fields which will be holds data for payment gateway -> stripeMetadat - in this object will be id of stripe product etc, so i will only pass one object to pay,ent gateway. Use also the same pattern to subscription ?

    const paymentIems = await this._populatePaymentItems(items)
    if (isEmpty(paymentIems)) throw new CustomError(`Can not configure your subscription items`, ErrorCode.INVALID_PRODUCT)

    const project = await this.projectModel
      .findOne<ProjectDocument<'owner'>>({
        _id: projectId,
      })
      .populate('owner')
    assertNotNullOrUndefined(project, 'project')

    const createdSubscription = await this._createSubscriptionOrRetriveIncompleted({
      projectId: project._id.toString(),
      period,
      items: paymentIems.map((item) => ({
        priceId: item.price._id,
        productId: item.product._id,
      })),
    })

    // TODO use payment gateway
    const stripeResponse = await this.stripeService.createFirstSubscription({
      subscriptionId: createdSubscription.id,
      project,
      period,
      paymentIems,
    })

    return {
      type: ChangeSubscriptionResponseType.CHECKOUT,
      checkoutUrl: stripeResponse.paymentUrl,
    }
  }

  private async _upgradePaidSubscription({ items, projectId, period }: CreateSubscriptionParams): Promise<ChangeSubscriptionResponse> {
    const paymentIems = await this._populatePaymentItems(items)
    if (isEmpty(paymentIems)) throw new CustomError(`Can not configure your subscription items`, ErrorCode.INVALID_PRODUCT)

    const project = await this.projectModel
      .findOne<ProjectDocument<'owner'>>({
        _id: projectId,
      })
      .populate('owner')
    assertNotNullOrUndefined(project, 'project')

    const currentActiveSubscription = await this.getActiveSubscriptionOnlyOneOrThrow({ projectId })
    if (currentActiveSubscription.id === this.DEFAULT_SUBSCRIPTION_ID)
      throw new CustomError(`Invalid subscription. Can not upgrade from default subscription`, ErrorCode.INVALID_PRODUCT)

    await this.stripeService.updateSubscription({
      currentSubscriptionId: currentActiveSubscription.id,
      project,
      // period,
      paymentIems,
    })

    return {
      type: ChangeSubscriptionResponseType.UPGRADE,
    }
  }

  private async _downgradePaidSubscription() {
    throw new CustomError(
      `Downgrade subscription is currently unsupported. If you want to perform this action, contact with our Team`,
      ErrorCode.FEATURE_NOT_IMPLEMENTED,
    )
  }

  async change(input: CreateSubscriptionParams): Promise<ChangeSubscriptionResponse | void> {
    if (input.items.length !== 1) throw new CustomError(`Currently only one item for subscription is supported`, ErrorCode.INVALID_PRODUCT)
    const item = input.items[0]

    const currentProjectSubscription = await this.getCurrentPlanOrThrow({ projectId: input.projectId })
    const newProductPlan = await this.productModel.findOne({
      _id: item.productId,
    })
    assertNotNullOrUndefined(newProductPlan, 'newProductPlan')

    if (currentProjectSubscription.name === 'Free') return this._createFirstPaidSubscription(input)
    if (currentProjectSubscription.priority < newProductPlan.priority) return this._upgradePaidSubscription(input)
    else if (currentProjectSubscription.priority > newProductPlan.priority) return this._downgradePaidSubscription()
    else throw new CustomError(`New plan is the same as current`, ErrorCode.INVALID_PRODUCT)
  }

  async findMany(filter: FilterQuery<SubscriptionDocument>): Promise<SubscriptionDocument<'items'>[]> {
    const subscriptions = await this.subscriptionModel.find<SubscriptionDocument<'items'>>(filter).populate(['items.price', 'items.product'])

    /* no one active subscription */
    if (!subscriptions.some((subscription) => subscription.status === SubscriptionStatus.ACTIVE))
      subscriptions.push(await this._getDefaultSubscription(filter.project))
    return subscriptions
  }

  async findOne(filter: FilterQuery<Subscription>) {
    return this.subscriptionModel.findOne(filter)
  }

  async getActiveSubscriptionOnlyOneOrThrow({ projectId }: { projectId: Id }) {
    const activeSubscriptions = await this.findMany({
      projectId: projectId,
      status: SubscriptionStatus.ACTIVE,
    })

    if (activeSubscriptions.length > 1)
      throw new CustomError(`More than one active subscription`, ErrorCode.INVALID_BILLING, {
        projectId,
      })

    /* return default subscription */
    if (!activeSubscriptions.length) return this._getDefaultSubscription(projectId)
    return activeSubscriptions[0]
  }

  async getCurrentPlanOrThrow({ projectId }: { projectId: Id }) {
    const activeSubscription = await this.getActiveSubscriptionOnlyOneOrThrow({ projectId })
    const planProducts = activeSubscription.items.filter((item) => item.product.type === ProductType.PLAN)
    if (planProducts.length > 1)
      throw new CustomError(`More than one product plan in subscription`, ErrorCode.INVALID_BILLING, {
        projectId,
        subscriptionId: activeSubscription.id,
      })
    return planProducts[0].product
  }

  @OnEvent(EVENT.SUBSCRIPTION.UPDATE)
  async handleSubscriptionUpdate(payload: SubscriptionUpdate) {
    this.logger.debug(`#handleSubscriptionUpdate`, payload)
    /* only retrive subscription to update, becouse we want to get projectId. This subscription can be incomplete */
    const newSubscription = await this.subscriptionModel
      .findOne<SubscriptionDocument<'items'>>({
        _id: payload.id,
      })
      .populate('items.price')
      .populate('items.product')
    assertNotNullOrUndefined(newSubscription, 'newSubscription')

    /* retrive current data before update using projectId also. Also retrive it, becouse it can be diffrent than newSubscription. New subscription can be incomplete, so activeSubscription can be Free default */
    const activeSubscriptions = await this.findMany({
      projectId: newSubscription.projectId,
      status: SubscriptionStatus.ACTIVE,
    })

    if (activeSubscriptions.length > 1)
      throw new CustomError(`More than one active subscription`, ErrorCode.INVALID_BILLING, {
        projectId: newSubscription.projectId.toString(),
      })

    /* get default subscription */
    if (!activeSubscriptions.length) {
      this.logger.debug(`First paid subscription, projectId=${newSubscription.projectId.toString()}`)
      activeSubscriptions[0] = await this._getDefaultSubscription(newSubscription.projectId.toString())
    }

    const oldPlanProducts = activeSubscriptions[0].items.filter((item) => item.product.type === ProductType.PLAN)
    if (oldPlanProducts.length > 1)
      throw new CustomError(`More than one product plan in old subscription`, ErrorCode.INVALID_BILLING, {
        projectId: newSubscription.projectId.toString(),
        subscriptionId: activeSubscriptions[0].id,
      })

    /* save new data */
    for (const [key, value] of Object.entries(payload.data) as [keyof Subscription, any][]) {
      (newSubscription[key] as any) = value
    }
    await newSubscription.save()

    // items were changed, populate again becouse the logic above don't do this
    if (payload.data.items) await newSubscription.populate(['items.price', 'items.product'])

    const newPlanProducts = newSubscription.items.filter((item) => item.product.type === ProductType.PLAN)
    if (newPlanProducts.length > 1)
      throw new CustomError(`More than one product plan in new subscription`, ErrorCode.INVALID_BILLING, {
        projectId: newSubscription.projectId.toString(),
        subscriptionId: activeSubscriptions[0].id,
      })

    /* side effect to update project limits */
    if (newSubscription.status === SubscriptionStatus.ACTIVE)
      this.eventEmitter.emit(EVENT.SUBSCRIPTION.PLAN.UPDATE, {
        oldSubscription: activeSubscriptions[0].toObject(),
        newSubscription: newSubscription.toObject(),
        oldPlan: oldPlanProducts[0].product.toObject(),
        newPlan: newPlanProducts[0].product.toObject(),
      } as SubscriptionPlanUpdate)
  }
}

interface CreateSubscriptionParams extends ChangeSubscriptionBody {
  projectId: Id
  period: SubscriptionPeriod
}
