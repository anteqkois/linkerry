import { ConditionEvent } from '@market-connector/core';
import { Injectable } from '@nestjs/common';


@Injectable()
export class ConditionsConsumer {
  processTriggered(conditionEvent: ConditionEvent) {

  }
}
