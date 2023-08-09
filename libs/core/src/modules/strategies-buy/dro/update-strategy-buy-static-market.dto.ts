import { IStrategyBuy_StaticMarket_UpdateInput } from '@market-connector/types'
import { CreateStrategyBuyStaticMarketDto } from './create-strategy-buy-static-market.dto'

export class UpdateStrategyBuyStaticMarketDto extends CreateStrategyBuyStaticMarketDto implements IStrategyBuy_StaticMarket_UpdateInput {
  readonly conditionMarketProvider?: string | undefined
  readonly user: string
  readonly triggeredTimes: number
  readonly validityUnix: number
}
