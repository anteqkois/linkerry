import { ConditionEvent } from '@market-connector/core';
import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ConditionsConsumer } from './conditions.consumer';

@Controller()
export class ConditionsController {
  constructor(private readonly conditionsConsumer: ConditionsConsumer) { }

  @EventPattern('condition.triggered')
  handleTriggeredCondition(@Payload(ValidationPipe) data: ConditionEvent) {
    console.log(data);
    this.conditionsConsumer.processTriggered(data)
  }
}
