import { Module } from '@nestjs/common';
import { AuthModule } from '../../lib/auth';
import { ConnectorsModule } from '../flows/connectors';
import { SandboxModule } from '../workers/sandbox/sandbox.module';
import { EngineService } from './engine.service';

@Module({
	imports: [ SandboxModule, AuthModule, ConnectorsModule],
	// providers: [EngineService, ConnectorsMetadataService],
	providers: [EngineService],
	exports: [EngineService],
})
export class EngineModule {}
