import { ICondition_UpdateInput } from '@market-connector/types';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateConditionDto } from './create.dto';

export class UpdateConditionDto extends CreateConditionDto implements ICondition_UpdateInput {
  @IsNumber()
  @IsNotEmpty()
  readonly triggeredTimes: number;
}
