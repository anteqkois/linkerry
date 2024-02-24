import { Module, forwardRef } from '@nestjs/common'
import { ConnectorsModule } from '../flows/connectors/connectors.module'
import { AuthModule } from '../users/auth'
import { SandboxModule } from '../workers/sandbox/sandbox.module'
import { EngineService } from './engine.service'

@Module({
	imports: [
		SandboxModule,
		AuthModule,
		forwardRef(() => ConnectorsModule),
	],
	providers: [EngineService],
	exports: [EngineService],
})
export class EngineModule {}
