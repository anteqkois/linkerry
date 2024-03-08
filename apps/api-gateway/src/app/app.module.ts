import {
	ActionsModule,
	AppConnectionsModule,
	AuthModule,
	ConnectorsModule,
	CoreModule,
	FlowVersionsModule,
	FlowsModule,
	ProjectsModule,
	StoreEntryModule,
	TestTriggerModule,
	TriggerEventsModule,
	UsersModule,
	WebhookSimulationModule,
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
		WebhookSimulationModule
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
