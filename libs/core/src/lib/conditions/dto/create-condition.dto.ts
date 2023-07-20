import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { ConditionOperatorType, ConditionTypeType, IndicatorType } from '@market-connector/core'

export class CreateConditionDto {

  @IsString()
  @IsEnum(ConditionTypeType)
  readonly type: ConditionTypeType;

  @IsString()
  @IsOptional()
  readonly symbol?: string;

  @IsString()
  @IsNotEmpty()
  readonly value: string;

  @IsString()
  @IsEnum(ConditionOperatorType)
  readonly operator: ConditionOperatorType;

  @IsBoolean()
  @IsNotEmpty()
  readonly triggered: boolean;

  @IsNumber()
  @IsNotEmpty()
  readonly triggeredTimes: number;

  @IsEnum(IndicatorType)
  @IsOptional()
  readonly indicator?: IndicatorType;

  @IsBoolean()
  @IsNotEmpty()
  readonly testMode: boolean
  // for future usecase
  // @IsBoolean()
  // @IsNotEmpty()
  // readonly required: boolean;
}
