import { IStrategyExecutionInput, Id, StrategyExecutionType } from '@market-connector/types'

export class CreateStrategyExecutionDto implements IStrategyExecutionInput {
  readonly exchanges: Id[]
  readonly type: StrategyExecutionType
}
