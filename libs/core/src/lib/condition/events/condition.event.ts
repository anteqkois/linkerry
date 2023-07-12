import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { ConditionOperatorType, ConditionTypeType } from "../types";
import { BaseEvent } from "../../event/entities/base.event";

export class ConditionEventData {
  @IsString()
  @IsEnum(ConditionTypeType)
  readonly type: ConditionTypeType;

  @IsString()
  @IsNotEmpty()
  readonly value: string;
}

export class ConditionEvent extends BaseEvent {
  @ValidateNested()
  @Type(() => ConditionEventData)
  readonly data: ConditionEventData;
}
