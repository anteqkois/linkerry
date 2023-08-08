import {
  IStrategyBuyInput,
  IStrategyBuy_Condition,
  Id,
  StrategyBuy_TypeType
} from '@market-connector/types'
import { Type } from 'class-transformer'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, IsMongoId, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'

export class StrategyBuyConditionDto implements IStrategyBuy_Condition {
  @IsMongoId()
  readonly id: Id
}

export class CreateStrategyBuyDto implements IStrategyBuyInput {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string

  @IsEnum(StrategyBuy_TypeType)
  @MinLength(2)
  @MaxLength(30)
  readonly type: StrategyBuy_TypeType

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => StrategyBuyConditionDto)
  readonly conditions: IStrategyBuy_Condition[]
}
