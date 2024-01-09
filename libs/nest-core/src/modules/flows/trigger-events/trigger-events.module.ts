import { Module } from '@nestjs/common';
import { TriggerEventsService } from './trigger-events.service';
import { TriggerEventsController } from './trigger-events.controller';

@Module({
  controllers: [TriggerEventsController],
  providers: [TriggerEventsService]
})
export class TriggerEventsModule {}
