import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EngineModule } from '../../engine/engine.module'
import { FlowVersionsModule } from '../flow-versions'
import { ConnectorsMetadataModule } from './connectors-metadata'
import { ConnectorsMetadataModelFactory } from './connectors-metadata/schemas/connector.schema'
import { ConnectorsController } from './connectors.controller'
import { ConnectorsService } from './connectors.service'

@Module({
	imports: [MongooseModule.forFeatureAsync([ConnectorsMetadataModelFactory]), FlowVersionsModule, ConnectorsMetadataModule, EngineModule],
	controllers: [ConnectorsController],
	providers: [ConnectorsService],
	exports: [ConnectorsService],
})
export class ConnectorsModule {}
