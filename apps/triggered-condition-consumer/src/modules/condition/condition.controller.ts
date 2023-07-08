import { Controller } from '@nestjs/common';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';
import { ConditionConsumer } from './condition.consumer';
import { CreateConditionDto } from './dto/create-condition.dto';

@Controller()
export class ConditionController {
  constructor(private readonly conditionService: ConditionConsumer) { }

  @MessagePattern('condition.triggered')
  readMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    const response =
      `Receiving a new message from topic: condition.triggered: ` +
      JSON.stringify(originalMessage.value);
    console.log(response);
    return response;
  }
  // @MessagePattern('createCondition')
  // create(@Payload() createConditionDto: CreateConditionDto) {
  //   return this.conditionService.processTriggered(createConditionDto);
  // }
}