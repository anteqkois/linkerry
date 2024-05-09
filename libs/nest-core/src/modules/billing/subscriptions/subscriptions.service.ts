import {
  ChangeSubscriptionBody,
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
import { Injectable } from '@nestjs/common'
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
	private readonly DEFAULT_VALIDITY_DATE
	private readonly DEFAULT_PRODUCT_ID

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
		this.DEFAULT_PRODUCT_ID = this.configService.getOrThrow('DEFAULT_PRODUCT_ID')
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
			project: projectId,
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

	private async _createFirstPaidSubscription({ items, projectId, period }: CreateSubscriptionParams) {
		// TODO use payment gateway architecture in future -> use paymentGateway.createSubscription() where in the background will be used the right gateway (stripe, crypto etc)
		// TODO? add to productModel fields which will be holds data for payment gateway -> stripeMetadat - in this object will be id of stripe product etc, so i will only pass one object to pay,ent gateway. Use also the same pattern to subscription ?

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
			checkoutUrl: stripeResponse.paymentUrl,
		}
	}

	private async _upgradePaidSubscription({ items, projectId, period }: CreateSubscriptionParams) {
		//
	}

	private async _downgradePaidSubscription() {
		throw new CustomError(
			`Downgrade subscription is currently unsupported. If you want to perform this action, contact with our Team`,
			ErrorCode.FEATURE_NOT_IMPLEMENTED,
		)
	}

	// async createDefault(projectId: Id) {
	// 	const createdSubscription = await this.subscriptionModel.create({
	// 		paymentGateway: PaymentGateway.NONE,
	// 		period: SubscriptionPeriod.MONTHLY,
	// 		projectId,
	// 		status: SubscriptionStatus.ACTIVE,
	// 		validTo: this.DEFAULT_VALIDITY_DATE,
  //     items:[]
	// 		// products: [new mongoose.Types.ObjectId(this.DEFAULT_PRODUCT_ID)],
	// 	})

	// 	return createdSubscription
	// }

	async change(input: CreateSubscriptionParams) {
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

	async findMany(filter: FilterQuery<Subscription>): Promise<SubscriptionDocument<'items'>[]> {
		const subscriptions = await this.subscriptionModel.find<SubscriptionDocument<'items'>>(filter).populate('items.price').populate('items.product')

		/* no one active subscription */
		if (!subscriptions.some((subscription) => subscription.status === SubscriptionStatus.ACTIVE))
			subscriptions.push(await this._getDefaultSubscription(filter.project))
		return subscriptions
	}

	async findOne(filter: FilterQuery<Subscription>) {
		return this.subscriptionModel.findOne(filter)
	}

	async getCurrentPlanOrThrow({ projectId }: { projectId: Id }) {
		const activeSubscriptions = await this.findMany({
			project: projectId,
			status: SubscriptionStatus.ACTIVE,
		})

		if (activeSubscriptions.length > 1)
			throw new CustomError(`More than one active subscription`, ErrorCode.INVALID_BILLING, {
				projectId,
			})

		/* return default subscription */
		if (!activeSubscriptions.length) (await this._getDefaultSubscription(projectId)).items[0].product

		const planProducts = activeSubscriptions[0].items.filter((item) => item.product.type === ProductType.PLAN)
		if (planProducts.length > 1)
			throw new CustomError(`More than one product plan in subscription`, ErrorCode.INVALID_BILLING, {
				projectId,
				subscriptionId: activeSubscriptions[0].id,
			})
		return planProducts[0].product
	}

	@OnEvent(EVENT.SUBSCRIPTION.UPDATE)
	async handleSubscriptionUpdate(payload: SubscriptionUpdate) {
		/* only retrive subscription to update, becouse we want to get projectId */
		const newSubscription = await this.subscriptionModel
			.findOne<SubscriptionDocument<'items'>>(
				{
					_id: payload.id,
				},
			)
			.populate('items.price')
			.populate('items.product')
		assertNotNullOrUndefined(newSubscription, 'newSubscription')

		/* retrive current data before update using projectId also */
		const activeSubscriptions = await this.findMany({
			project: newSubscription.projectId,
			status: SubscriptionStatus.ACTIVE,
		})

		if (activeSubscriptions.length > 1)
			throw new CustomError(`More than one active subscription`, ErrorCode.INVALID_BILLING, {
				projectId: newSubscription.projectId.toString(),
			})

		/* get default subscription */
		if (!activeSubscriptions.length) activeSubscriptions[0] = await this._getDefaultSubscription(newSubscription.projectId.toString())

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

		const newPlanProducts = activeSubscriptions[0].items.filter((item) => item.product.type === ProductType.PLAN)
		if (oldPlanProducts.length > 1)
			throw new CustomError(`More than one product plan in new subscription`, ErrorCode.INVALID_BILLING, {
				projectId: newSubscription.projectId.toString(),
				subscriptionId: activeSubscriptions[0].id,
			})

		/* side effect to update project limits */
		this.eventEmitter.emit(EVENT.SUBSCRIPTION.PLAN.UPDATE, {
			oldSubscription: activeSubscriptions[0].toObject(),
			newSubscription: newSubscription.toObject(),
			oldPlan: oldPlanProducts[0].toObject(),
			newPlan: newPlanProducts[0].product.toObject(),
		} as SubscriptionPlanUpdate)
	}
}

interface CreateSubscriptionParams extends ChangeSubscriptionBody {
	projectId: Id
	period: SubscriptionPeriod
}
