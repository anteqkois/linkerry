import {
	ActionsModule,
	AppConnectionsModule,
	AuthModule,
	ConnectorsModule,
	CoreModule,
	FilesModule,
	FlowVersionsModule,
	FlowWorkerModule,
	FlowsModule,
	Oauth2Module,
	PricesModule,
	ProductsModule,
	ProjectsModule,
	StoreEntryModule,
	SubscriptionHistoryModule,
	SubscriptionsModule,
	TestTriggerModule,
	TriggerEventsModule,
	UsersModule,
	WebhookSimulationModule,
	WebhooksModule,
} from '@linkerry/nest-core'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
	imports: [
		CoreModule,
		UsersModule,
		AuthModule,
		FlowsModule,
		FlowVersionsModule,
		ConnectorsModule,
		TriggerEventsModule,
		ActionsModule,
		AppConnectionsModule,
		ProjectsModule,
		StoreEntryModule,
		TestTriggerModule,
		WebhookSimulationModule,
		FlowWorkerModule,
		FilesModule,
		Oauth2Module,
		WebhooksModule,
		ProductsModule,
		SubscriptionsModule,
		PricesModule,
		SubscriptionHistoryModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
