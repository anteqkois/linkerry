import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { BaseEvent } from "../../events/entities/base.event";
import { ConditionTypeType, IConditionEvent } from "@market-connector/types";

export class ConditionEventData {
  @IsString()
  @IsEnum(ConditionTypeType)
  readonly type: ConditionTypeType;

  @IsString()
  @IsNotEmpty()
  readonly value: string;
}

export class ConditionEvent extends BaseEvent implements IConditionEvent {
  @ValidateNested()
  @Type(() => ConditionEventData)
  readonly data: ConditionEventData;
}
