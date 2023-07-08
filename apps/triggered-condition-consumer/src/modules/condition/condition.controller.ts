import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConditionService } from './condition.service';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';

@Controller()
export class ConditionController {
  constructor(private readonly conditionService: ConditionService) {}

  @MessagePattern('createCondition')
  create(@Payload() createConditionDto: CreateConditionDto) {
    return this.conditionService.processTriggered(createConditionDto);
  }
}
