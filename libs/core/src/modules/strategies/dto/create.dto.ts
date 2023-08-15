import { IStrategyStrategyBuy, IStrategy_CreateInput, Id, StrategyType } from '@market-connector/types'
import { Type } from 'class-transformer'
import { IsArray, IsBoolean, IsDefined, IsEnum, IsMongoId, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator'
import { CreateStrategyBuyStaticMarketDto } from '../../strategies-buy/dro/static-market/create.dto'

export class StrategyStrategyBuyDto implements IStrategyStrategyBuy {
  @IsOptional()
  @IsMongoId()
  readonly id?: Id

  @IsOptional()
  @IsMongoId()
  readonly strategyBuy?: string

  @IsDefined()
  @IsBoolean()
  readonly active: boolean

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateStrategyBuyStaticMarketDto)
  readonly strategyBuyCreateInput?: CreateStrategyBuyStaticMarketDto
}

export class CreateStrategyDto implements IStrategy_CreateInput {
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  readonly name: string

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  @IsEnum(StrategyType)
  readonly type: StrategyType

  @IsArray()
  @IsOptional()
  @IsMongoId({ each: true })
  readonly strategySell: Id[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyStrategyBuyDto)
  strategyBuy: StrategyStrategyBuyDto[]

  // @IsArray()
  // @IsOptional()
  // @IsMongoId({ each: true })
  // strategyPause: Id[]

  @IsBoolean()
  readonly testMode: boolean

  @IsBoolean()
  readonly active: boolean
}
