import { Module } from '@nestjs/common';
import { AuthModule } from '../../lib/auth';
import { ConnectorsMetadataModule } from '../connectors-metadata';
import { SandboxModule } from '../workers/sandbox/sandbox.module';
import { EngineService } from './engine.service';

@Module({
	imports: [ConnectorsMetadataModule, SandboxModule, AuthModule],
	providers: [EngineService],
	exports: [EngineService],
})
export class EngineModule {}
