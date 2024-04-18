import {
	CreatePaidSubscriptionBody,
	CustomError,
	ErrorCode,
	Id,
	PaymentGateway,
	ProductType,
	Subscription,
	SubscriptionPeriod,
	SubscriptionStatus,
	SubscriptionStripe,
	assertNotNullOrUndefined,
	isEmpty,
} from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import mongoose, { FilterQuery, Model } from 'mongoose'
import { ProjectDocument, ProjectModel } from '../../projects/schemas/projects.schema'
import { PaymentItem, StripeService } from '../payments/stripe.service'
import { PriceDocument, PriceModel } from '../products/prices/price.schema'
import { ProductDocument, ProductModel } from '../products/product.schema'
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
	) {
		this.DEFAULT_VALIDITY_DATE = this.configService.getOrThrow('DEFAULT_VALIDITY_DATE')
		this.DEFAULT_PRODUCT_ID = this.configService.getOrThrow('DEFAULT_PRODUCT_ID')
	}

	async createDefault(projectId: Id) {
		const createdSubscription = await this.subscriptionModel.create({
			currentPeriodEnd: this.DEFAULT_VALIDITY_DATE,
			paymentGateway: PaymentGateway.NONE,
			period: SubscriptionPeriod.MONTHLY,
			projectId,
			status: SubscriptionStatus.ACTIVE,
			validTo: this.DEFAULT_VALIDITY_DATE,
			products: [new mongoose.Types.ObjectId(this.DEFAULT_PRODUCT_ID)],
		})

		return createdSubscription
	}

	async create(input: Subscription) {
		const createdSubscription = await this.subscriptionModel.create(input)
		return createdSubscription
	}

	async findMany(filter: FilterQuery<Subscription>): Promise<SubscriptionDocument<'products'>[]> {
		return this.subscriptionModel.find(filter).populate('products')
	}

	async findOne(filter: FilterQuery<Subscription>) {
		return this.subscriptionModel.findOne(filter)
	}

	async getCurrentPlanConfigurationOrThrow({ projectId }: { projectId: Id }) {
		const subscriptions = await this.subscriptionModel.find<SubscriptionDocument<'products'>>({ projectId }).populate('products')
		const currentSubscription = subscriptions.filter((subscription) => subscription.status === SubscriptionStatus.ACTIVE)
		if (currentSubscription.length > 1)
			throw new CustomError(`More than one active subscription`, ErrorCode.INVALID_BILLING, {
				projectId,
			})

		const planProducts = currentSubscription[0].products.filter((product) => product.type === ProductType.PLAN)
		if (planProducts.length > 1)
			throw new CustomError(`More than one product plan in subscription`, ErrorCode.INVALID_BILLING, {
				projectId,
			})
		return planProducts[0].config
	}

	async createPaidSubscription({ items, projectId, period }: CreatePaidSubscriptionParams) {
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

		const project = await this.projectModel.findOne<ProjectDocument<'owner'>>({
			_id: projectId,
		}).populate('owner')
		assertNotNullOrUndefined(project, 'project')

		// TODO use payment gateway
		const stripeCheckoutSession = await this.stripeService.createSubscriptionCheckoutSession({
			project: project.toObject(),
			period,
			paymentIems,
		})

		// const nowDate = dayjs().toISOString()
		// const input: Omit<SubscriptionStripe, '_id'> = {
		// 	currentPeriodEnd: nowDate,
		// 	paymentGateway: PaymentGateway.STRIPE,
		// 	period,
		// 	projectId,
		// 	status: SubscriptionStatus.INCOMPLETE,
		// 	validTo: nowDate,
		// 	products: paymentIems.map((item) => item.product._id),
		// 	defaultPaymentMethod: null,
		// 	stripeSubscriptionId: '',
		// }

		// const createdSubscription = await this.subscriptionModel.create({})
	}

	async getPaymentLinkForSubscription() {
		//
	}
}

interface CreatePaidSubscriptionParams extends CreatePaidSubscriptionBody {
	projectId: Id
	period: SubscriptionPeriod
}
