import { Controller, ValidationPipe } from '@nestjs/common';
import { ConditionConsumer } from './condition.consumer';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ConditionEvent } from '@market-connector/core'

@Controller()
export class ConditionController {
  constructor(private readonly conditionConsumer: ConditionConsumer) { }

  @EventPattern('condition.triggered')
  handleTriggeredCondition(@Payload(ValidationPipe) data: ConditionEvent) {
    console.log(data);
    this.conditionConsumer.processTriggered(data)
  }
}
