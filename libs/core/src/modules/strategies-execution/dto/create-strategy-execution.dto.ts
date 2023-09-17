import { IStrategyExecution_CreateInput, StrategyExecutionType } from '@market-connector/types'
import { Id } from '@market-connector/shared'

export class CreateStrategyExecutionDto implements IStrategyExecution_CreateInput {
  readonly exchanges: Id[]
  readonly type: StrategyExecutionType
}
