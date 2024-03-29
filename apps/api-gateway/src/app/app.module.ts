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
		WebhookSimulationModule,
		FlowWorkerModule,
		FilesModule,
		Oauth2Module
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
