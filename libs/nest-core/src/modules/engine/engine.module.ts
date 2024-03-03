import { Module, forwardRef } from '@nestjs/common'
import { AppEventRoutingModule } from '../app-event-routing'
import { ConnectorsModule } from '../flows/connectors/connectors.module'
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
		forwardRef(() => ConnectorsModule),
	],
	providers: [EngineService],
	exports: [EngineService],
})
export class EngineModule {}
