import { IStrategy_CreateInput, Id, StrategyType } from '@market-connector/types'
import { IsArray, IsBoolean, IsEnum, IsMongoId, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreateStrategyDto implements IStrategy_CreateInput {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string


  @IsEnum(StrategyType)
  @MinLength(2)
  @MaxLength(30)
  readonly type: StrategyType

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  readonly strategySell: Id[]

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  readonly strategyBuy: Id[]

  // @IsArray()
  // @IsOptional()
  // @IsMongoId({ each: true })
  // strategyPause: Id[]

  @IsBoolean()
  readonly testMode: boolean

  @IsBoolean()
  readonly active: boolean
}
