import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProjectModelFactory } from '../../projects/schemas/projects.schema'
import { PaymentsModule } from '../payments/payments.module'
import { PriceModelFactory } from '../products/prices/price.schema'
import { ProductModelFactory } from '../products/product.schema'
import { SubscriptionModelFactory } from './schemas/subscription.schema'
import { SubscriptionsAdminController } from './subscriptions-admin.controller'
import { SubscriptionsController } from './subscriptions.controller'
import { SubscriptionsService } from './subscriptions.service'

@Module({
	imports: [MongooseModule.forFeatureAsync([SubscriptionModelFactory, ProductModelFactory, PriceModelFactory, ProjectModelFactory]), PaymentsModule],
	controllers: [SubscriptionsController, SubscriptionsAdminController],
	providers: [SubscriptionsService],
	exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
