import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CryptoModule } from '../../lib/crypto'
import { RedisLockModule } from '../../lib/redis-lock'
import { EngineModule } from '../engine/engine.module'
import { ConnectorsMetadataModule } from '../flows/connectors/connectors-metadata/connectors-metadata.module'
import { AppConnectionsController } from './app-connections.controller'
import { AppConnectionsService } from './app-connections.service'
import { AppConnectionsModelFactory } from './schemas/connections.schema'
import { WorkerAppConnectionsController } from './worker-app-connections.controller'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([AppConnectionsModelFactory]),
		EngineModule,
		ConnectorsMetadataModule,
		CryptoModule,
		RedisLockModule,
	],
	controllers: [AppConnectionsController, WorkerAppConnectionsController],
	providers: [AppConnectionsService],
})
export class AppConnectionsModule {}
