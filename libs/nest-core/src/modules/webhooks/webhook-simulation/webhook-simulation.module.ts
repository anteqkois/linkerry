import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { flowVersionModelFactory } from '../../flows/flow-versions/schemas/flow-version.schema'
import { TriggerHooksModule } from '../../flows/triggers/trigger-hooks/trigger-hooks.module'
import { WebhookSimulationModelFactory } from './schemas/webhook-simulation.schema'
import { WebhookSimulationController } from './webhook-simulation.controller'
import { WebhookSimulationService } from './webhook-simulation.service'

@Module({
  imports: [MongooseModule.forFeatureAsync([WebhookSimulationModelFactory, flowVersionModelFactory]), TriggerHooksModule],
  controllers: [WebhookSimulationController],
  providers: [WebhookSimulationService],
  exports: [WebhookSimulationService],
})
export class WebhookSimulationModule {}
