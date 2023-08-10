import { IStrategy_StaticMarket_UpdateInput, Id, StrategyState } from '@market-connector/types'
import { CreateStrategyStaticMarketDto } from './create-static-market.dto'

export class UpdateStrategyStaticMarketDto extends CreateStrategyStaticMarketDto implements IStrategy_StaticMarket_UpdateInput {
  readonly _id: Id
  readonly triggeredTimes: number
  readonly validityUnix: number
  readonly user: string
  readonly state: StrategyState
}
