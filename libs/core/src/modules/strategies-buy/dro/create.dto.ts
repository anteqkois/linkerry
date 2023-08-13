import {
  ICondition_CreateInput,
  IStrategyBuy_Condition,
  IStrategyBuy_CreateInput,
  Id,
  StrategyBuyType
} from '@market-connector/types'
import { Type } from 'class-transformer'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsMongoId, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'

export class StrategyBuyConditionDto implements IStrategyBuy_Condition {
  @IsMongoId()
  readonly id?: Id
  readonly active: boolean
  readonly condition?: string
  readonly conditionCreateInput?: ICondition_CreateInput | undefined
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
