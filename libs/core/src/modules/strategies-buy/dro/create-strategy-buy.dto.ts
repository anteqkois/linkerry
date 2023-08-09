import {
  IStrategyBuy_Condition,
  IStrategyBuy_CreateInput,
  Id,
  StrategyBuyType
} from '@market-connector/types'
import { Type } from 'class-transformer'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsMongoId, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'

export class StrategyBuyConditionDto implements IStrategyBuy_Condition {
  @IsMongoId()
  readonly id: Id
}

export class CreateStrategyBuyDto implements IStrategyBuy_CreateInput {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string

  @IsEnum(StrategyBuyType)
  @MinLength(2)
  @MaxLength(30)
  readonly type: StrategyBuyType

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => StrategyBuyConditionDto)
  readonly conditions: IStrategyBuy_Condition[]
}
