import {  Injectable } from '@nestjs/common';
import { CreateConditionEventDto } from '@market-connector/core'


@Injectable()
export class ConditionConsumer {
  processTriggered(createConditionDto: CreateConditionEventDto) {

  }
}
