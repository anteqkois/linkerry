import { Injectable } from '@nestjs/common';
import { ConditionEvent } from './events/condition.event';


@Injectable()
export class ConditionsConsumer {
  processTriggered(conditionEvent: ConditionEvent) {

  }
}
