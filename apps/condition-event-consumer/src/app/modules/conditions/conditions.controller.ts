import { ConditionEvent, ConditionsConsumer } from '@market-connector/nest-core';
import { Controller, ValidationPipe } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class ConditionsController {
  constructor(private readonly conditionsConsumer: ConditionsConsumer) { }

  @EventPattern('condition.triggered')
  handleTriggeredCondition(@Payload(ValidationPipe) data: ConditionEvent) {
    console.log(data);
    this.conditionsConsumer.processTriggered(data)
  }
}
