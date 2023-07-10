import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateEventDto } from "../../event/dto/create-event.dto";
import { ConditionOperatorType, ConditionTypeType } from "../types";

export class ConditionEventDataDto {
  @IsString()
  @IsEnum(ConditionTypeType)
  readonly type: ConditionTypeType;

  @IsString()
  @IsNotEmpty()
  readonly value: string;
}

export class CreateConditionEventDto extends CreateEventDto {
  // @ValidateNested()
  // @Type(() => ConditionEventDataDto)
  // override readonly data: ConditionEventDataDto;
}

