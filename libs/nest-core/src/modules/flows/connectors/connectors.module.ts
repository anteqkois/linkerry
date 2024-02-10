import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EngineModule } from '../../engine/engine.module'
import { FlowVersionsModule } from '../flow-versions'
import { ConnectorsMetadataService } from './connectors-metadata/connectors-metadata.service'
import { ConnectorMetadataModelFactory } from './connectors-metadata/schemas/connector.schema'
import { ConnectorsController } from './connectors.controller'
import { ConnectorsService } from './connectors.service'

@Module({
	imports: [
		MongooseModule.forFeatureAsync([ConnectorMetadataModelFactory]),
		FlowVersionsModule,
		forwardRef(() => EngineModule),
	],
	controllers: [ConnectorsController],
	providers: [ConnectorsService, ConnectorsMetadataService],
	exports: [ConnectorsService, ConnectorsMetadataService],
})
export class ConnectorsModule {}
