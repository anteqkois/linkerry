// import { ActionType, CodeAction, GenericStepOutput, StepOutputStatus } from '@activeconnectors/shared'
// import { BaseExecutor } from './base-executor'
// import { EngineConstantData } from './context/engine-constants'
// import { ExecutionVerdict, FlowExecutorContext } from './context/flow-execution-context'

// type CodeConnectorModule = {
//     code(params: unknown): Promise<unknown>
// }

// export const codeExecutor: BaseExecutor<CodeAction> = {
//     async handle({
//         action,
//         executionState,
//         constants,
//     }: {
//         action: CodeAction
//         executionState: FlowExecutorContext
//         constants: EngineConstantData
//     }) {
//         if (executionState.isCompleted({ stepName: action.name })) {
//             return executionState
//         }
//         const { censoredInput, resolvedInput } = await constants.variableService.resolve({
//             unresolvedInput: action.settings.input,
//             executionState,
//         })
//         const stepOutput = GenericStepOutput.create({
//             input: censoredInput,
//             type: ActionType.Code,
//             status: StepOutputStatus.SUCCEEDED,
//         })
//         try {
//             const artifactPath = `${constants.baseCodeDirectory}/${action.name}/index.js`
//             const codeConnectorModule: CodeConnectorModule = await import(artifactPath)
//             const output = await codeConnectorModule.code(resolvedInput)
//             return executionState.upsertStep(action.name, stepOutput.setOutput(output))
//         }
//         catch (e) {
//             console.error(e)
//             return executionState
//                 .upsertStep(action.name, stepOutput.setStatus(StepOutputStatus.FAILED).setErrorMessage((e as Error).message))
//                 .setVerdict(ExecutionVerdict.FAILED, undefined)
//         }
//     },
// }
