import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { SubscriptionModelFactory } from './schemas/subscription.schema'
import { SubscriptionsAdminController } from './subscriptions-admin.controller'
import { SubscriptionsController } from './subscriptions.controller'
import { SubscriptionsService } from './subscriptions.service'

@Module({
	imports: [MongooseModule.forFeatureAsync([SubscriptionModelFactory])],
	controllers: [SubscriptionsController, SubscriptionsAdminController],
	providers: [SubscriptionsService],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
