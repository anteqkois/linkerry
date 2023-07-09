import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { ConditionConsumer } from './condition.consumer';
import { CreateConditionDto } from './dto/create-condition.dto';

@Controller()
export class ConditionController {
  constructor(private readonly conditionService: ConditionConsumer) { }

  // @MessagePattern('condition.triggered')
  // handleTriggered(@Payload() message: any, @Ctx() context: KafkaContext) {
  //   this.conditionService.processTriggered(JSON.stringify(context.getMessage()))
  // }
}
