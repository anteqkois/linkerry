import { IStrategyBuy_UpdateInput } from '@market-connector/types'
import { CreateStrategyBuyDto } from './create.dto'

export class UpdateStrategyBuyDto extends CreateStrategyBuyDto implements IStrategyBuy_UpdateInput {
  readonly triggeredTimes: number
  readonly validityUnix: number
  readonly conditionMarketProvider?: string
}
