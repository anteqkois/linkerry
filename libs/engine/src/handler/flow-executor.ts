import { Action, ActionType, isNull } from '@linkerry/shared'
import { BaseExecutor } from './base-executor'
// import { branchExecutor } from './branch-executor'
import { EngineConstants } from './context/engine-constants'
import { ExecutionVerdict, FlowExecutorContext } from './context/flow-execution-context'
// import { loopExecutor } from './loop-executor'
import { connectorExecutor } from './connector-executor'

// @ts-ignore
const executeFunction: Record<ActionType, BaseExecutor<Action>> = {
    // [ActionType.Code]: codeExecutor,
    // [ActionType.Branch]: branchExecutor,
    // [ActionType.LoopOnItems]: loopExecutor,
    [ActionType.CONNECTOR]: connectorExecutor,
    [ActionType.MERGE_BRANCH]: connectorExecutor, // todo implement
}

export const flowExecutor = {
    getExecutorForAction(type: ActionType): BaseExecutor<Action> {
        const executor = executeFunction[type]
        if (isNull(executor)) {
            throw new Error('Not implemented')
        }
        return executor
    },
    async execute({ action, constants, executionState }: {
        action: Action
        executionState: FlowExecutorContext
        constants: EngineConstants
    }): Promise<FlowExecutorContext> {
        const startTime = new Date().getMilliseconds()
        let flowExecutionContext = executionState
        let currentAction: Action | undefined = action
        while (!isNull(currentAction)) {
            const handler = this.getExecutorForAction(currentAction.type)
            flowExecutionContext = await handler.handle({
                action: currentAction,
                executionState: flowExecutionContext,
                constants,
            })
            if (flowExecutionContext.verdict !== ExecutionVerdict.RUNNING) {
                return flowExecutionContext
            }
            // currentAction = currentAction.nextAction
            currentAction = undefined
        }
        return flowExecutionContext.setDuration(new Date().getMilliseconds() - startTime)
    },
}
