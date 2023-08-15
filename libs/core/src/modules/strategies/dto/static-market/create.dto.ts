import { IStrategy_StaticMarket_CreateInput } from '@market-connector/types'
import { Type } from 'class-transformer'
import { IsArray, IsOptional, ValidateNested } from 'class-validator'
import { CreateStrategyBuyStaticMarketDto } from '../../../strategies-buy/dro/static-market/create.dto'
import { CreateStrategyDto, StrategyStrategyBuyDto } from '../create.dto'


export class StrategyStrategyBuyStaticMarketDto extends StrategyStrategyBuyDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateStrategyBuyStaticMarketDto)
  override readonly strategyBuyCreateInput?: CreateStrategyBuyStaticMarketDto
}

export class CreateStrategyStaticMarketDto extends CreateStrategyDto implements IStrategy_StaticMarket_CreateInput {

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StrategyStrategyBuyDto)
  override strategyBuy: StrategyStrategyBuyDto[]
}
