import { IStrategyExecution_CreateInput, Id, StrategyExecutionType } from '@market-connector/types'

export class CreateStrategyExecutionDto implements IStrategyExecution_CreateInput {
  readonly exchanges: Id[]
  readonly type: StrategyExecutionType
}
