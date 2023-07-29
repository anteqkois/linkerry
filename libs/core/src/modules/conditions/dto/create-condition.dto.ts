import {
  AlertProviderType,
  ConditionOperatorType,
  ConditionTypeType,
  IConditionAlertInput,
  IConditionInput,
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
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'

export class CreateConditionDto implements IConditionInput {
  @IsString()
  @IsEnum(ConditionTypeType)
  readonly type: ConditionTypeType

  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsNumber()
  @IsNotEmpty()
  readonly requiredValue: number

  @IsString()
  @IsEnum(ConditionOperatorType)
  readonly operator: ConditionOperatorType

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

export class CreateAlertDto {
  @IsString()
  @IsEnum(AlertProviderType)
  readonly provider: AlertProviderType
}

export class CreateConditionAlertDto extends CreateConditionDto implements IConditionAlertInput {
  @IsString()
  @IsEnum(ConditionTypeType)
  override readonly type: ConditionTypeType.ALERT

  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateAlertDto)
  alert!: CreateAlertDto
}
