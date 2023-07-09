import { IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator";
import { CreateEventDto } from "../../../common/kafka/dto/create-event.dto";

enum ConditionType {
  ALERT = 'alert',
  INDICATOR = 'indicator',
}

// It's important in condition, not Event
enum ConditionOperator {
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

export class CreateConditionEventDto implements CreateEventDto {
  @IsString()
  @IsNotEmpty()
  readonly object: string;

  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @IsString()
  @IsNotEmpty()
  readonly ticker: string;

  @IsString()
  @IsEnum(ConditionType)
  readonly type: ConditionType;

  @IsString()
  @IsNotEmpty()
  readonly value: string;

  @IsString()
  @IsEnum(ConditionOperator)
  readonly operator: ConditionOperator;
}
