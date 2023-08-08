import {
  AlertProvider,
  ConditionOperator,
  ConditionType,
  IAlert_CreateInput,
  ICondition_CreateInput,
} from '@market-connector/types'
import { Type } from 'class-transformer'
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator'

export class CreateConditionDto implements ICondition_CreateInput {
  @IsString()
  @IsEnum(ConditionType)
  readonly type: ConditionType

  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsNumber()
  @IsNotEmpty()
  readonly requiredValue: number

  @IsString()
  @IsEnum(ConditionOperator)
  readonly operator: ConditionOperator

  @IsNumber()
  @IsNotEmpty()
  readonly eventValidityUnix: number

  @IsBoolean()
  @IsNotEmpty()
  readonly isMarketProvider: boolean

  @IsBoolean()
  @IsNotEmpty()
  readonly testMode: boolean

  @IsBoolean()
  @IsNotEmpty()
  readonly active: boolean
}

export class ConditionAlertDto {
  @IsString()
  @IsEnum(AlertProvider)
  readonly provider: AlertProvider
}

export class CreateAlertDto extends CreateConditionDto implements IAlert_CreateInput {
  @IsString()
  @IsEnum(ConditionType)
  override readonly type: ConditionType.Alert

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => ConditionAlertDto)
  alert!: ConditionAlertDto
}
