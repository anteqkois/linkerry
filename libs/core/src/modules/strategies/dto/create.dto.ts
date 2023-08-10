import { IStrategy_CreateInput, IStrategy_StrategyBuy, Id, StrategyType } from '@market-connector/types'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsDefined, IsEnum, IsMongoId, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'

export class StrategyStrategyBuyDto implements IStrategy_StrategyBuy {
  @IsDefined()
  @IsMongoId()
  readonly id: Id

  @IsDefined()
  @IsBoolean()
  readonly active: boolean

  @IsDefined()
  @IsMongoId()
  readonly strategyBuy: string
}

export class CreateStrategyDto implements IStrategy_CreateInput {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string

  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @IsEnum(StrategyType)
  readonly type: StrategyType

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  readonly strategySell: Id[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyStrategyBuyDto)
  readonly strategyBuy: StrategyStrategyBuyDto[]

  // @IsArray()
  // @IsOptional()
  // @IsMongoId({ each: true })
  // strategyPause: Id[]

  @IsBoolean()
  readonly testMode: boolean

  @IsBoolean()
  readonly active: boolean
}
