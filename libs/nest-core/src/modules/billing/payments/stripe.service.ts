import { InjectStripeClient, StripeWebhookHandler } from '@golevelup/nestjs-stripe'
import {
  CustomError,
  ErrorCode,
  Id,
  PaymentGateway,
  Price,
  Product,
  SubscriptionPeriod,
  SubscriptionStatus,
  assertNotNullOrUndefined,
} from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { Model } from 'mongoose'
import { Stripe } from 'stripe'
import { EVENT } from '../../configs/events-emitter'
import { ProjectDocument } from '../../projects/schemas/projects.schema'
import { PriceDocument, PriceModel } from '../products/prices/price.schema'
import { ProductDocument, ProductModel } from '../products/product.schema'
import { SubscriptionUpdate } from '../subscriptions/events'

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name)

  constructor(
    @InjectModel(ProductModel.name) private readonly productModel: Model<ProductDocument>,
    @InjectModel(PriceModel.name) private readonly priceModel: Model<PriceDocument>,
    @InjectStripeClient() private readonly stripeClient: Stripe,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    //
  }

  @StripeWebhookHandler('customer.subscription.created')
  customerSubscriptionCreated(event: Stripe.CustomerSubscriptionCreatedEvent) {
    this.logger.log(`#customerSubscriptionCreated event ${event.id} ${event.data.object.metadata}`)
    const { object } = event.data
    if (!isSubscriptionMetadata(object.metadata)) throw new CustomError(`Invalid event metadata`, ErrorCode.INVALID_BILLING, object.metadata)

    this.eventEmitter.emit(EVENT.SUBSCRIPTION.UPDATE, {
      id: object.metadata.subscriptionId,
      data: {
        paymentGateway: PaymentGateway.STRIPE,
        validTo: dayjs(object.current_period_end * 1000).toISOString(),
        status: object.status,
      },
    } as SubscriptionUpdate)

    return {
      success: true,
    }
  }

  @StripeWebhookHandler('customer.subscription.updated')
  async customerSubscriptionUpdated(event: Stripe.CustomerSubscriptionUpdatedEvent) {
    this.logger.log(`#customer.subscription.updated event ${event.id} ${JSON.stringify(event.data.object.metadata)}`)
    const { object, previous_attributes } = event.data
    if (!isSubscriptionMetadata(object.metadata)) throw new CustomError(`Invalid event metadata`, ErrorCode.INVALID_BILLING, object.metadata)

    const customerSubscription = await this.stripeClient.subscriptions.retrieve(object.id)
    assertNotNullOrUndefined(customerSubscription, 'customerSubscription')

    const update: SubscriptionUpdate['data'] = {
      paymentGateway: PaymentGateway.STRIPE,
    }
    if (previous_attributes?.current_period_end) update.validTo = dayjs(object.current_period_end * 1000).toISOString()
    if (previous_attributes?.status && Object.values(SubscriptionStatus).includes((previous_attributes?.status ?? '') as SubscriptionStatus))
      update.status = object.status as SubscriptionStatus
    else if (previous_attributes?.status)
      throw new CustomError(`Unknown subscribe status`, ErrorCode.INVALID_BILLING, { status: previous_attributes?.status })
    if (previous_attributes?.items) {
      update.items = []

      for (const item of object.items.data) {
        const product = await this.productModel.findOne({
          'stripe.id': item.price.product,
        })
        assertNotNullOrUndefined(product, `product=${item.price.product}`)
        const price = await this.priceModel.findOne({
          'stripe.id': item.price.id,
          productId: product.id,
        })
        assertNotNullOrUndefined(price, `price=${item.price.id}`)
        update.items.push({
          productId: product.id,
          priceId: price?.id,
        })
      }
    }

    // check if user have default payment method, if not set it
    const stripeCustomer = await this.stripeClient.customers.retrieve(event.data.object.customer.toString())
    if (stripeCustomer.deleted) throw new CustomError(`Stripe customer is deleted`, ErrorCode.INVALID_TYPE, { customerId: stripeCustomer.id })
    if (!(stripeCustomer as Stripe.Customer).invoice_settings.default_payment_method && typeof event.data.object.default_payment_method === 'string')
      await this.stripeClient.customers.update(stripeCustomer.id, {
        invoice_settings: {
          default_payment_method: event.data.object.default_payment_method,
        },
      })

    this.eventEmitter.emit(EVENT.SUBSCRIPTION.UPDATE, {
      id: object.metadata.subscriptionId,
      data: update,
    } as SubscriptionUpdate)

    return {
      success: true,
    }
  }

  private async _getCustomerOrCreate({ project }: { project: ProjectDocument<'owner'> }) {
    let customer = (
      await this.stripeClient.customers.search({
        query: `metadata["projectId"]:"${project._id.toString()}"`,
      })
    ).data[0]

    if (!customer) {
      customer = await this.stripeClient.customers.create({
        name: project.displayName,
        email: project.owner.email,
        phone: String(project.owner.phone),
        preferred_locales: [project.owner.language || 'pl'],
        metadata: {
          projectId: project._id.toString(),
        },
      })
    }

    return customer
  }

  private async _getCustomerOrThrow({ project }: { project: ProjectDocument<'owner'> }) {
    const customer = (
      await this.stripeClient.customers.search({
        query: `metadata["projectId"]:"${project._id.toString()}"`,
      })
    ).data[0]

    if (!customer)
      throw new CustomError(`Can not find stripe customer`, ErrorCode.ENTITY_NOT_FOUND, {
        project: project._id.toString(),
      })

    return customer
  }

  async createFirstSubscription({
    paymentIems,
    project,
    subscriptionId,
  }: CreateSubscriptionCheckoutSessionProps): Promise<CreateSubscriptionCheckoutSessionRespons> {
    const customer = await this._getCustomerOrCreate({ project })

    const customerSessions = await this.stripeClient.checkout.sessions.list({
      customer: customer.id,
      expand: ['data.line_items', 'data.subscription'],
      status: 'open',
    })

    // /* to reset all checkot sessions */
    // for (const session of customerSessions.data) {
    // 	await this.stripeClient.checkout.sessions.expire(session.id)
    // }
    // customerSessions.data = []

    let openSessionsForThisPaymentItems: Stripe.Checkout.Session | null = null
    const sessionToExpired: string[] = []

    /* sessions are sorted starting from sessions with the longest expired at timestamp */
    for (const session of customerSessions.data) {
      /* Session found earlier */
      if (openSessionsForThisPaymentItems) sessionToExpired.push(session.id)

      const lineItems = session.line_items?.data ?? []

      /* check if all products are in checkout session */
      for (const paymentItem of paymentIems) {
        const lineItemIndex =
          lineItems.findIndex((lineItem) => {
            if (lineItem.price!.id === paymentItem.price.stripe.id && lineItem.price?.product === paymentItem.product.stripe.id) return true
            return false
          }) ?? -1
        if (lineItemIndex === -1) {
          sessionToExpired.push(session.id)
          /* not all products are in checout session */
          continue
        }
        lineItems.splice(lineItemIndex)
      }
      /* At the end it can not be any item => all items included in session, so they were deleted from array */
      if (lineItems.length) sessionToExpired.push(session.id)
      else openSessionsForThisPaymentItems = session
    }

    if (sessionToExpired.length) {
      for (const sessionId of sessionToExpired) {
        await this.stripeClient.checkout.sessions.expire(sessionId)
      }
    }

    if (openSessionsForThisPaymentItems && !openSessionsForThisPaymentItems?.url)
      await this.stripeClient.checkout.sessions.expire(openSessionsForThisPaymentItems.id)
    else if (openSessionsForThisPaymentItems && openSessionsForThisPaymentItems?.url)
      return {
        paymentUrl: openSessionsForThisPaymentItems.url,
      }

    const metadata: SubscriptionMetadata & Stripe.MetadataParam = {
      projectId: project._id.toString(),
      subscriptionId: subscriptionId.toString(),
    }

    const session = await this.stripeClient.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      line_items: paymentIems.map((item) => ({
        price: item.price.stripe.id,
        quantity: 1,
      })),
      subscription_data: {
        metadata,
      },
      success_url: `${this.configService.getOrThrow('FRONTEND_HOST')}/app/payments/success`,
      cancel_url: `${this.configService.getOrThrow('FRONTEND_HOST')}/app/subscriptions`,
      metadata,
    })

    assertNotNullOrUndefined(session.url, 'missing payment url')

    return { paymentUrl: session.url }
  }

  async updateSubscription({
    paymentIems,
    project,
    currentSubscriptionId,
  }: UpdateSubscriptionCheckoutSessionProps): Promise<UpdateSubscriptionCheckoutSessionRespons> {
    const customer = await this._getCustomerOrCreate({ project })

    const currentStripeSubscription = (
      await this.stripeClient.subscriptions.search({
        query: `metadata["subscriptionId"]:"${currentSubscriptionId}"`,
      })
    ).data[0]

    if (!currentStripeSubscription)
      throw new CustomError(`Can not retrive current stripe subscription`, ErrorCode.ENTITY_NOT_FOUND, {
        currentSubscriptionId,
      })

    if (customer.metadata['projectId'] !== currentStripeSubscription.metadata['projectId'])
      throw new CustomError(`Invalid subscription retrived`, ErrorCode.INVALID_TYPE, {
        customerProjectId: customer.metadata['projectId'],
        subscriptionProjectId: currentStripeSubscription.metadata['projectId'],
      })

    await this.stripeClient.subscriptions.update(currentStripeSubscription.id, {
      items: [
        // close all other products
        ...currentStripeSubscription.items.data.map((item) => ({ id: item.id, deleted: true })),
        ...paymentIems.map((item) => ({
          price: item.price.stripe.id,
          quantity: 1,
        })),
      ],
    })
  }
}

const isSubscriptionMetadata = (data: unknown): data is SubscriptionMetadata => {
  if (data && typeof data === 'object' && 'projectId' in data && 'subscriptionId' in data) return true
  return false
}

interface SubscriptionMetadata {
  projectId: string
  subscriptionId: string
}

interface CreateSubscriptionCheckoutSessionProps {
  subscriptionId: Id
  project: ProjectDocument<'owner'>
  period: SubscriptionPeriod
  paymentIems: PaymentItem[]
}

interface CreateSubscriptionCheckoutSessionRespons {
  paymentUrl: string
}

interface UpdateSubscriptionCheckoutSessionProps {
  currentSubscriptionId: Id
  project: ProjectDocument<'owner'>
  // period: SubscriptionPeriod
  paymentIems: PaymentItem[]
}

type UpdateSubscriptionCheckoutSessionRespons = { paymentUrl: string } | void

export interface PaymentItem {
  product: Product
  price: Price
}

export interface StripeCustomerMetadata {
  projectId: Id
}
