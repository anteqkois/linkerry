import { Subscription } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { SubscriptionDocument, SubscriptionModel } from './schemas/subscription.schema'

@Injectable()
export class SubscriptionsAdminService {
	constructor(
		@InjectModel(SubscriptionModel.name) private readonly subscriptionModel: Model<SubscriptionDocument>,
		private readonly configService: ConfigService,
	) {}

	async create(input: Subscription) {
		const createdSubscription = await this.subscriptionModel.create(input)
		return createdSubscription
	}

	// async findMany(filter: FilterQuery<Subscription>): Promise<SubscriptionDocument<'products'>[]> {
	// 	return this.subscriptionModel.find(filter).populate('products')
	// }

	async findOne(filter: FilterQuery<Subscription>) {
		return this.subscriptionModel.findOne(filter)
	}
}
