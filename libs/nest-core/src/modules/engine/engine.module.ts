import { Module } from '@nestjs/common'
import { AppEventRoutingModule } from '../app-event-routing'
import { ConnectorsMetadataModule } from '../flows/connectors/connectors-metadata'
import { AuthModule } from '../users/auth'
import { WebhooksModule } from '../webhooks'
import { SandboxModule } from '../workers/sandbox/sandbox.module'
import { EngineService } from './engine.service'

@Module({
	imports: [
		SandboxModule,
		AuthModule,
		AppEventRoutingModule,
		WebhooksModule,
		ConnectorsMetadataModule
	],
	providers: [EngineService],
	exports: [EngineService],
})
export class EngineModule {}
