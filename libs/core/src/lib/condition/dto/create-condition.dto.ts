import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { ConditionOperatorType, ConditionTypeType } from "../types";
import { IndicatorType } from "../../indicator/types";

export class CreateConditionDto {
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

  @IsBoolean()
  @IsNotEmpty()
  readonly triggered: boolean;

  @IsNumber()
  @IsNotEmpty()
  readonly triggeredTimes: number;

  @IsEnum(IndicatorType)
  @IsNotEmpty()
  readonly indicator: IndicatorType;


  // for future usecase
  // @IsBoolean()
  // @IsNotEmpty()
  // readonly required: boolean;
}
