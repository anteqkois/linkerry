import {
  ICondition_CreateInput,
  IStrategyBuy_Condition,
  IStrategyBuy_CreateInput,
  StrategyBuyType
} from '@market-connector/types'
import { Id } from '@market-connector/shared'
import { Type } from 'class-transformer'
import { ArrayMaxSize, IsArray, IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'
import { CreateConditionDto } from '../../conditions/dto/create.dto'

export class StrategyBuyConditionDto implements IStrategyBuy_Condition {
  @IsOptional()
  @IsMongoId()
  readonly id?: Id

  @IsBoolean()
  readonly active: boolean

  @IsOptional()
  @IsMongoId()
  readonly condition?: string

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateConditionDto)
  readonly conditionCreateInput?: ICondition_CreateInput
}

export class CreateStrategyBuyDto implements IStrategyBuy_CreateInput {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  readonly name: string

  @IsEnum(StrategyBuyType)
  @MinLength(2)
  @MaxLength(100)
  readonly type: StrategyBuyType

  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => StrategyBuyConditionDto)
  conditions: IStrategyBuy_Condition[]
}
