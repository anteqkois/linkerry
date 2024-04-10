import { Id, PaymentGateway, Subscription, SubscriptionPeriod, SubscriptionStatus } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { SubscriptionDocument, SubscriptionModel } from './schemas/subscription.schema'

@Injectable()
export class SubscriptionsService {
	private readonly DEFAULT_VALIDITY_DATE
	private readonly DEFAULT_PRODUCT_ID

	constructor(
		@InjectModel(SubscriptionModel.name) private readonly subscriptionModel: Model<SubscriptionDocument>,
		private readonly configService: ConfigService,
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
			subscriptionStatus: SubscriptionStatus.ACTIVE,
			validTo: this.DEFAULT_VALIDITY_DATE,
			products: [new mongoose.Types.ObjectId(this.DEFAULT_PRODUCT_ID)],
		})

		return createdSubscription
	}

	async create(input: Subscription) {
		const createdSubscription = await this.subscriptionModel.create(input)
		return createdSubscription
	}

	async findMany() {
		return this.subscriptionModel.find()
	}

	async findOne(id: Id) {
		return this.subscriptionModel.findOne({
			_id: id,
		})
	}
}
