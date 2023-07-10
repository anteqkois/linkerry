import { Type } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { CreateEventDto } from "../../event/dto/create-event.dto";
import { ConditionOperatorType, ConditionTypeType } from "../types";

export class ConditionEventDataDto {
  // @IsString()
  // @IsNotEmpty()
  // readonly ticker: string;

  @IsString()
  @IsEnum(ConditionTypeType)
  readonly type: ConditionTypeType;

  @IsString()
  @IsNotEmpty()
  readonly value: string;

  // @IsString()
  // @IsEnum(ConditionOperatorType)
  // readonly operator: ConditionOperatorType;

}

export class CreateConditionEventDto extends CreateEventDto {
  @ValidateNested()
  @Type(() => ConditionEventDataDto)
  readonly data: ConditionEventDataDto;
}

