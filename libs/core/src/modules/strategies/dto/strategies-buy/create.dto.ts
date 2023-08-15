import { IsBoolean } from 'class-validator'
import { CreateStrategyBuyStaticMarketDto } from '../../../strategies-buy/dro/static-market/create.dto'

export class CreateStrategyStrategyBuyDto extends CreateStrategyBuyStaticMarketDto {
  @IsBoolean()
  readonly active: boolean
}
