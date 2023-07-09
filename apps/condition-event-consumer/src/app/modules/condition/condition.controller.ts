import { Controller, ValidationPipe } from '@nestjs/common';
import { ConditionConsumer } from './condition.consumer';
import { Ctx, EventPattern, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateConditionEventDto } from '@market-connector/core'

@Controller()
export class ConditionController {
  constructor(private readonly conditionConsumer: ConditionConsumer) { }

  @EventPattern('condition.triggered')
  handleTriggeredCondition(@Payload(ValidationPipe) data: CreateConditionEventDto) {
    console.log(data);
    this.conditionConsumer.processTriggered(data)
  }
}
