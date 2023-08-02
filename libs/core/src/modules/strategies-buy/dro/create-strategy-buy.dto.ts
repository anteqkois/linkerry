import {
  IStrategyBuyInput,
  IStrategyBuy_Condition,
  Id,
  StrategyBuy_TypeType,
} from '@market-connector/types'
import { Type } from 'class-transformer'
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'
import { CreateStrategyBuyCondition } from './create-strategy-buy-condition.dto'

export class CreateStrategyBuy implements IStrategyBuyInput {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  readonly name: string

  @IsBoolean()
  readonly active: boolean

  @IsBoolean()
  readonly testMode: boolean

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  readonly strategySell: Id[]

  @IsEnum(StrategyBuy_TypeType)
  @MinLength(2)
  @MaxLength(20)
  readonly type: StrategyBuy_TypeType

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CreateStrategyBuyCondition)
  readonly conditions: IStrategyBuy_Condition[]
}
