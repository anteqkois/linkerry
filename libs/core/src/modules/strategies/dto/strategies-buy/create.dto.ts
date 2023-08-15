import { IsBoolean } from 'class-validator'
import { CreateStrategyBuyStaticMarketDto } from '../../../strategies-buy/dro/staticMarket/create.dto'

export class CreateStrategyStrategyBuyDto extends CreateStrategyBuyStaticMarketDto {
  @IsBoolean()
  readonly active: boolean
}
