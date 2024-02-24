import { ActionType, BranchStepOutput, FlowVersion, GenricStepOutput, StepOutputStatus, TriggerType, flowHelper } from '@linkerry/shared'
import { FlowExecutorContext } from './flow-execution-context'

export const testExecutionContext = {
    async stateFromFlowVersion({ flowVersion, excludedStepName }: {
        flowVersion: FlowVersion
        excludedStepName?: string
        projectId: string
        workerToken: string
    }): Promise<FlowExecutorContext> {
        const flowSteps = flowHelper.getAllSteps(flowVersion)
        let flowExecutionContext = FlowExecutorContext.empty()

        for (const step of flowSteps) {
            const { name, settings: { inputUiInfo } } = step
            if (name === excludedStepName) {
                continue
            }

            const stepType = step.type
            switch (stepType) {
                case ActionType.BRANCH:
                    flowExecutionContext = flowExecutionContext.upsertStep(step.name, BranchStepOutput.init({
                        input: step.settings,
                    }))
                    break
                // case ActionType.LoopOnItems: {
                //     const { resolvedInput } = await variableService({
                //         projectId,
                //         workerToken,
                //     }).resolve<{ items: unknown[] }>({
                //         unresolvedInput: step.settings,
                //         executionState: flowExecutionContext,
                //     })
                //     flowExecutionContext = flowExecutionContext.upsertStep(step.name, LoopStepOutput.init({
                //         input: step.settings,
                //     }).setOutput({
                //         item: resolvedInput.items[0],
                //         index: 1,
                //         iterations: [],
                //     }))
                //     break
                // }
								// case ActionType.Code:
                case ActionType.ACTION:
                case TriggerType.EMPTY:
                case TriggerType.TRIGGER:
                case TriggerType.WEBHOOK:
                    flowExecutionContext = flowExecutionContext.upsertStep(step.name, GenricStepOutput.create({
                        input: step.settings,
                        type: stepType,
                        status: StepOutputStatus.SUCCEEDED,
                        output: inputUiInfo?.currentSelectedData,
                    }))
                    break
            }
        }
        return flowExecutionContext
    },
}

