import { Injectable } from '@nestjs/common';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';

@Injectable()
export class ConditionService {
  processTriggered(createConditionDto: CreateConditionDto) {
    return 'This action adds a new condition';
  }
}
