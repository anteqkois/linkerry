import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { WebhookSimulationModule } from '../../webhooks/webhook-simulation'
import { ConnectorsMetadataModule } from '../connectors/connectors-metadata/connectors-metadata.module'
import { StepFilesModule } from '../step-files/step-files.module'
import { FlowVersionsController } from './flow-versions.controller'
import { FlowVersionsService } from './flow-versions.service'
import { flowVersionModelFactory } from './schemas/flow-version.schema'

@Module({
  imports: [MongooseModule.forFeatureAsync([flowVersionModelFactory]), WebhookSimulationModule, StepFilesModule, ConnectorsMetadataModule],
  controllers: [FlowVersionsController],
  providers: [FlowVersionsService],
  exports: [FlowVersionsService],
})
export class FlowVersionsModule {}
