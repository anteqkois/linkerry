import { IsBoolean } from 'class-validator'
import { CreateStrategyBuyStaticMarketDto } from '../../../strategies-buy/dro/static-market/create.dto'
import { IStrategy_StrategyBuyCreateInput } from '@market-connector/types'

export class CreateStrategyStrategyBuyDto extends CreateStrategyBuyStaticMarketDto implements IStrategy_StrategyBuyCreateInput {
  @IsBoolean()
  readonly active: boolean
}
