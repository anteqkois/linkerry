import {
	ActionContext,
	ConnectionsManager,
	ConnectorPropertyMap,
	PauseHook,
	PauseHookParams,
	StaticPropsValue,
	StopHook,
	StopHookParams,
	TagsManager,
} from '@linkerry/connectors-framework'
import {
	ActionConnector,
	ActionType,
	ExecutionType,
	FlowRunStatus,
	GenericStepOutput,
	PauseType,
	StepOutputStatus,
	assertNotNullOrUndefined,
	isNil,
} from '@linkerry/shared'
import { connectorLoader } from '../helper/connector-loader'
import { continueIfFailureHandler, runWithExponentialBackoff } from '../helper/error-handling'
import { createConnectionService } from '../services/connections.service'
import { createFilesService } from '../services/files.service'
import { createContextStore } from '../services/storage.service'
import { AUTHENTICATION_PROPERTY_NAME } from '../services/veriables.service'
import { utils } from '../utils'
import { ActionHandler, BaseExecutor } from './base-executor'
import { EngineConstants } from './context/engine-constants'
import { ExecutionVerdict, FlowExecutorContext } from './context/flow-execution-context'

type HookResponse = {
	stopResponse: StopHookParams | undefined
	pauseResponse: PauseHookParams | undefined
	tags: string[]
	stopped: boolean
	paused: boolean
}

export const connectorExecutor: BaseExecutor<ActionConnector> = {
	async handle({ action, executionState, constants }: { action: ActionConnector; executionState: FlowExecutorContext; constants: EngineConstants }) {
		if (executionState.isCompleted({ stepName: action.name })) {
			return executionState
		}
		const resultExecution = await runWithExponentialBackoff(executionState, action, constants, executeAction)
		return continueIfFailureHandler(resultExecution, action, constants)
	},
}

const executeAction: ActionHandler<ActionConnector> = async ({ action, executionState, constants }) => {
	const stepOutput = GenericStepOutput.create({
		input: {},
		type: ActionType.CONNECTOR,
		status: StepOutputStatus.SUCCEEDED,
	})

	try {
		assertNotNullOrUndefined(action.settings.actionName, 'actionName')
		const { connectorAction, connector } = await connectorLoader.getConnectorAndActionOrThrow({
			connectorName: action.settings.connectorName,
			connectorVersion: action.settings.connectorVersion,
			actionName: action.settings.actionName,
			connectorsSource: constants.connectorsSource,
		})

		const { resolvedInput, censoredInput } = await constants.variableService.resolve<StaticPropsValue<ConnectorPropertyMap>>({
			unresolvedInput: action.settings.input,
			executionState,
		})

		stepOutput.input = censoredInput

		const { processedInput, errors } = await constants.variableService.applyProcessorsAndValidators(resolvedInput, connectorAction.props, connector.auth)
		if (Object.keys(errors).length > 0) {
			throw new Error(JSON.stringify(errors))
		}

		const hookResponse: HookResponse = {
			stopResponse: undefined,
			stopped: false,
			pauseResponse: undefined,
			paused: false,
			tags: [],
		}
		const isPaused = executionState.isPaused({ stepName: action.name })
		const context: ActionContext = {
			executionType: isPaused ? ExecutionType.RESUME : ExecutionType.BEGIN,
			resumePayload: constants.resumePayload!,
			store: createContextStore({
				prefix: '',
				flowId: constants.flowId,
				workerToken: constants.workerToken,
			}),
			auth: processedInput[AUTHENTICATION_PROPERTY_NAME],
			files: createFilesService({
				workerToken: constants.workerToken,
				stepName: action.name,
				flowId: constants.flowId,
				type: constants.filesServiceType,
			}),
			server: {
				token: constants.workerToken,
				apiUrl: constants.apiUrl,
				publicUrl: constants.serverUrl,
			},
			propsValue: processedInput,
			tags: createTagsManager(hookResponse),
			connections: createConnectionManager({
				projectId: constants.projectId,
				workerToken: constants.workerToken,
				hookResponse,
			}),
			serverUrl: constants.serverUrl,
			run: {
				id: constants.flowRunId,
				stop: createStopHook(hookResponse),
				pause: createPauseHook(hookResponse, executionState.pauseRequestId),
			},
			project: {
				id: constants.projectId,
				// externalId: constants.externalProjectId,
			},
			generateResumeUrl: (params) => {
				// TODO check this route exists
				const url = new URL(`${constants.serverUrl}v1/flow-runs/${constants.flowRunId}/requests/${executionState.pauseRequestId}`)
				url.search = new URLSearchParams(params.queryParams).toString()
				return url.toString()
			},
		}
		const runMethodToExecute = constants.testSingleStepMode && !isNil(connectorAction.test) ? connectorAction.test : connectorAction.run
		const output = await runMethodToExecute(context)
		const newExecutionContext = executionState.addTags(hookResponse.tags)

		if (hookResponse.stopped) {
			assertNotNullOrUndefined(hookResponse.stopResponse, 'stopResponse')
			return newExecutionContext
				.upsertStep(action.name, stepOutput.setOutput(output))
				.setVerdict(ExecutionVerdict.SUCCEEDED, {
					reason: FlowRunStatus.STOPPED,
					stopResponse: hookResponse.stopResponse.response,
				})
				.increaseTask()
		}
		if (hookResponse.paused) {
			assertNotNullOrUndefined(hookResponse.pauseResponse, 'pauseResponse')
			return newExecutionContext
				.upsertStep(action.name, stepOutput.setOutput(output).setStatus(StepOutputStatus.PAUSED))
				.setVerdict(ExecutionVerdict.PAUSED, {
					reason: FlowRunStatus.PAUSED,
					pauseMetadata: hookResponse.pauseResponse.pauseMetadata,
				})
		}

		return newExecutionContext.upsertStep(action.name, stepOutput.setOutput(output)).increaseTask().setVerdict(ExecutionVerdict.RUNNING, undefined)
	} catch (e) {
		const errorMessage = await utils.tryParseJson((e as Error).message)
		console.error(errorMessage)

		return executionState
			.upsertStep(action.name, stepOutput.setStatus(StepOutputStatus.FAILED).setErrorMessage(errorMessage))
			.setVerdict(ExecutionVerdict.FAILED, undefined)
	}
}

const createTagsManager = (hookResponse: HookResponse): TagsManager => {
	return {
			add: async (params: {
					name: string
			}): Promise<void> => {
					hookResponse.tags.push(params.name)
			},

	}
}

const createConnectionManager = ({ workerToken, projectId, hookResponse }: { projectId: string, workerToken: string, hookResponse: HookResponse }): ConnectionsManager => {
	return {
			get: async (key: string) => {
					try {
							const connection = await createConnectionService({ projectId, workerToken }).obtain(key)
							hookResponse.tags.push(`connection:${key}`)
							return connection
					}
					catch (e) {
							return null
					}
			},
	}
}

function createStopHook(hookResponse: HookResponse): StopHook {
	return (req: StopHookParams) => {
			hookResponse.stopped = true
			hookResponse.stopResponse = req
	}
}

function createPauseHook(hookResponse: HookResponse, pauseId: string): PauseHook {
	return (req) => {
			hookResponse.paused = true
			switch (req.pauseMetadata.type) {
					case PauseType.DELAY:
							hookResponse.pauseResponse = {
									pauseMetadata: req.pauseMetadata,
							}
							break
					case PauseType.WEBHOOK:
							hookResponse.pauseResponse = {
									pauseMetadata: {
											...req.pauseMetadata,
											requestId: pauseId,
									},
							}
							break
			}
	}
}
