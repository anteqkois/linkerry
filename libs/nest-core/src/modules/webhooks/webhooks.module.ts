import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FlowRunsModule } from '../flows/flow-runs/flow-runs.module';
import { flowVersionModelFactory } from '../flows/flow-versions/schemas/flow-version.schema';
import { WebhookSimulationModule } from './webhook-simulation/webhook-simulation.module';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
  imports: [MongooseModule.forFeatureAsync([flowVersionModelFactory]), WebhookSimulationModule, FlowRunsModule],
  controllers: [WebhooksController],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}
