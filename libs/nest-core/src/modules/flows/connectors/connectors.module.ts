import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EngineModule } from '../../engine/engine.module'
import { flowVersionModelFactory } from '../flow-versions/schemas/flow-version.schema'
import { ConnectorsMetadataModule } from './connectors-metadata/connectors-metadata.module'
import { ConnectorsMetadataModelFactory } from './connectors-metadata/schemas/connector.schema'
import { ConnectorsController } from './connectors.controller'
import { ConnectorsService } from './connectors.service'

@Module({
  imports: [MongooseModule.forFeatureAsync([ConnectorsMetadataModelFactory, flowVersionModelFactory]), ConnectorsMetadataModule, EngineModule],
  controllers: [ConnectorsController],
  providers: [ConnectorsService],
  exports: [ConnectorsService],
})
export class ConnectorsModule {}
