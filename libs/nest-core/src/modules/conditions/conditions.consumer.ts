import { Injectable } from '@nestjs/common';
import { EventConditionDto } from './events/condition.event.dto';


@Injectable()
export class ConditionsConsumer {
  processTriggered(conditionEvent: EventConditionDto) {

  }
}
