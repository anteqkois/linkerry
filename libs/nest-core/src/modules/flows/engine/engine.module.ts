import { Module } from '@nestjs/common';
import { ConnectorsMetadataModule } from '../../connectors-metadata';
import { EngineService } from './engine.service';
import { SandboxModule } from '../../workers/sandbox/sandbox.module';

@Module({
	imports: [ConnectorsMetadataModule, SandboxModule],
	providers: [EngineService],
	exports: [EngineService],
})
export class EngineModule {}
