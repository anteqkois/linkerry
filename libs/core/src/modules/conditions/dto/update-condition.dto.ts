import { PartialType } from '@nestjs/mapped-types';
import { CreateConditionDto } from './create-condition.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateConditionDto extends PartialType(CreateConditionDto) {
  @IsNumber()
  @IsNotEmpty()
  readonly triggeredTimes: number;
}
