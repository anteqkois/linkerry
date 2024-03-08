import { Module } from '@nestjs/common';
import { WebhookSimulationModule } from '../../webhooks/webhook-simulation';
import { TriggerEventsModule } from '../trigger-events/trigger-events.module';
import { TestTriggerController } from './test-trigger.controller';
import { TestTriggerService } from './test-trigger.service';

@Module({
	imports:[WebhookSimulationModule, TriggerEventsModule],
  controllers: [TestTriggerController],
  providers: [TestTriggerService]
})
export class TestTriggerModule {}
