import { Module, forwardRef } from '@nestjs/common'
import { AuthModule } from '../../lib/auth'
import { ConnectorsModule } from '../flows/connectors/connectors.module'
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
