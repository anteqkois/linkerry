import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateEventDto } from "../../events/dto/create-event.dto";


export enum ConditionTypeType {
  ALERT = 'alert',
  INDICATOR = 'indicator',
}

// It's important in condition, not Event
export enum ConditionOperatorType {
  // 'equal' = 'equal',
  CROSSING = 'crossing',
  CROSSING_UP = 'crossingUp',
  CROSSING_DOWN = 'crossingDown',
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
  // Entering Channel= '' // User must defined bands
  // Exiting Channel= ''
  // Inside Channel= ''
  // Outside Channel= ''
  MOVING_UP = 'movingUp', // Value => $300
  MOVING_DOWN = 'movingDown',
  MOVING_UP_PERCENT = 'MovingUpPercent', // % => 10%
  MOVING_DOWN_PERCENT = 'MovingDownPercent',
}

export class ConditionEventDataDto {
  @IsString()
  @IsNotEmpty()
  readonly ticker: string;

  @IsString()
  @IsEnum(ConditionTypeType)
  readonly type: ConditionTypeType;

  @IsString()
  @IsNotEmpty()
  readonly value: string;

  @IsString()
  @IsEnum(ConditionOperatorType)
  readonly operator: ConditionOperatorType;

}

export class CreateConditionEventDto extends CreateEventDto {
  @ValidateNested()
  @Type(() => ConditionEventDataDto)
  readonly data: ConditionEventDataDto;
}

