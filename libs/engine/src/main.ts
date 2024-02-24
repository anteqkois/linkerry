import {
    Action,
    ActionType,
    CustomError,
    EngineOperationType,
    EngineResponse,
    EngineResponseStatus,
    EngineTestOperation,
    ErrorCode,
    ExecuteActionResponse,
    ExecuteExtractConnectorMetadata,
    ExecuteFlowOperation,
    ExecutePropsOptions,
    ExecuteStepOperation,
    ExecuteTriggerOperation,
    ExecuteValidateAuthOperation,
    ExecutionOutput,
    ExecutionType,
    GenricStepOutput,
    StepOutputStatus,
    TriggerHookType,
    assertNotNullOrUndefined,
    flowHelper,
    isNil,
} from '@linkerry/shared'
import { argv } from 'node:process'
import { EngineConstants } from './handler/context/engine-constants'
import { ExecutionVerdict, FlowExecutorContext } from './handler/context/flow-execution-context'
import { testExecutionContext } from './handler/context/test-execution-context'
import { flowExecutor } from './handler/flow-executor'
import { connectorHelper } from './helper/connector-helper'
import { triggerHelper } from './helper/trigger-helper'
import { utils } from './utils'

const executeFlow = async (input: ExecuteFlowOperation, context: FlowExecutorContext): Promise<EngineResponse<ExecutionOutput>> => {
	const action = input.flowVersion.actions.find((action) => action.name === input.flowVersion.triggers[0].nextActionName)
	assertNotNullOrUndefined(action, 'action', {
		nextActionName: input.flowVersion.triggers[0].nextActionName,
	})

	const output = await flowExecutor.execute({
		action,
		executionState: context,
		constants: EngineConstants.fromExecuteFlowInput(input),
	})
	return {
		status: EngineResponseStatus.OK,
		response: await output.toExecutionOutput(),
	}
}

async function executeStep(input: ExecuteStepOperation): Promise<ExecuteActionResponse> {
	const step = flowHelper.getStep(input.flowVersion, input.stepName) as Action | undefined
	if (isNil(step) || !Object.values(ActionType).includes(step.type))
		throw new CustomError('Step not found or not supported', ErrorCode.INVALID_TYPE, {
			step,
		})

	const output = await flowExecutor.getExecutorForAction(step.type).handle({
		action: step,
		executionState: await testExecutionContext.stateFromFlowVersion({
			flowVersion: input.flowVersion,
			excludedStepName: step.name,
			projectId: input.projectId,
			workerToken: input.workerToken,
		}),
		constants: EngineConstants.fromExecuteStepInput(input),
	})
	return {
		success: output.verdict !== ExecutionVerdict.FAILED,
		output: output.steps[step.name].output ?? output.steps[step.name].errorMessage,
	}
}

function getFlowExecutionState(input: ExecuteFlowOperation): FlowExecutorContext {
	switch (input.executionType) {
		case ExecutionType.BEGIN:
			return FlowExecutorContext.empty().upsertStep(
				input.flowVersion.triggers[0].name,
				GenricStepOutput.create({
					type: input.flowVersion.triggers[0].type,
					status: StepOutputStatus.SUCCEEDED,
					input: {},
				}).setOutput(input.triggerPayload),
			)
		case ExecutionType.RESUME: {
			let flowContext = FlowExecutorContext.empty().increaseTask(input.tasks)
			for (const [step, output] of Object.entries(input.executionState.steps)) {
				if (output.status === StepOutputStatus.SUCCEEDED) {
					flowContext = flowContext.upsertStep(step, output)
				}
			}
			return flowContext
		}
	}
}

const execute = async (): Promise<void> => {
	try {
		const operationType = argv[2]

		switch (operationType) {
			case EngineOperationType.EXTRACT_CONNECTOR_METADATA: {
				const input: ExecuteExtractConnectorMetadata = await utils.parseJsonFile(EngineConstants.INPUT_FILE)
				const output = await connectorHelper.extractConnectorMetadata({
					params: input,
					connectorSource: EngineConstants.CONNECTOR_SOURCES,
				})
				await writeOutput({
					status: EngineResponseStatus.OK,
					response: output,
				})
				break
			}
			case EngineOperationType.EXECUTE_FLOW: {
				const input: ExecuteFlowOperation = await utils.parseJsonFile(EngineConstants.INPUT_FILE)
				const flowExecutorContext = getFlowExecutionState(input)
				const output = await executeFlow(input, flowExecutorContext)
				await writeOutput(output)
				break
			}
			case EngineOperationType.EXECUTE_PROPERTY: {
				const input: ExecutePropsOptions = await utils.parseJsonFile(EngineConstants.INPUT_FILE)
				const output = await connectorHelper.executeProps({
					params: input,
					connectorSource: EngineConstants.CONNECTOR_SOURCES,
					executionState: await testExecutionContext.stateFromFlowVersion({
						flowVersion: input.flowVersion,
						projectId: input.projectId,
						workerToken: input.workerToken,
					}),
					constants: EngineConstants.fromExecutePropertyInput(input),
				})
				await writeOutput({
					status: EngineResponseStatus.OK,
					response: output,
				})
				break
			}
			case EngineOperationType.EXECUTE_TRIGGER_HOOK: {
				const input: ExecuteTriggerOperation<TriggerHookType> = await utils.parseJsonFile(EngineConstants.INPUT_FILE)

				const output = await triggerHelper.executeTrigger({
					params: input,
					constants: EngineConstants.fromExecuteTriggerInput(input),
				})
				await writeOutput({
					status: EngineResponseStatus.OK,
					response: output,
				})
				break
			}
			case EngineOperationType.EXECUTE_STEP: {
				const input: ExecuteStepOperation = await utils.parseJsonFile(EngineConstants.INPUT_FILE)
				const output = await executeStep(input)
				await writeOutput({
					status: EngineResponseStatus.OK,
					response: output,
				})
				break
			}
			case EngineOperationType.EXECUTE_VALIDATE_AUTH: {
				const input: ExecuteValidateAuthOperation = await utils.parseJsonFile(EngineConstants.INPUT_FILE)
				const output = await connectorHelper.executeValidateAuth({
					params: input,
					connectorSource: EngineConstants.CONNECTOR_SOURCES,
				})

				await writeOutput({
					status: EngineResponseStatus.OK,
					response: output,
				})
				break
			}
			case EngineOperationType.EXECUTE_TEST_FLOW: {
				const input: EngineTestOperation = await utils.parseJsonFile(EngineConstants.INPUT_FILE)
				const testExecutionState = await testExecutionContext.stateFromFlowVersion({
					flowVersion: input.sourceFlowVersion,
					projectId: input.projectId,
					workerToken: input.workerToken,
				})
				const output = await executeFlow(input, testExecutionState)
				await writeOutput(output)
				break
			}
			default:
				console.error('unknown operation')
				break
		}
	} catch (e: any) {
		console.error(e, e.stack)
		await writeOutput({
			status: EngineResponseStatus.ERROR,
			response: utils.tryParseJson((e as Error).message),
		})
	}
}

execute().catch((e) => console.error(e, e.stack))

async function writeOutput(result: EngineResponse<unknown>): Promise<void> {
	await utils.writeToJsonFile(EngineConstants.OUTPUT_FILE, result)
}
