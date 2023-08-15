import { IStrategy_UpdateInput, Id, StrategyState } from '@market-connector/types'
import { CreateStrategyDto } from './create.dto'

export class UpdateStrategyDto extends CreateStrategyDto implements IStrategy_UpdateInput {
  _id: Id
  readonly triggeredTimes: number
  readonly validityUnix: number
  readonly user: string
  readonly state: StrategyState
}
