import {
  ActionType,
  BeginExecuteFlowOperation,
  ConnectorPackage,
  CustomError,
  ErrorCode,
  ExecutioOutputFile,
  ExecutionType,
  File,
  FileCompression,
  FileType,
  FlowRunResponse,
  FlowRunStatus,
  FlowStatus,
  FlowVersion,
  Id,
  MAX_LOG_SIZE,
  ResumeExecuteFlowOperation,
  ResumePayload,
  RunEnvironment,
  SandBoxCacheType,
  TriggerType,
  assertNotNullOrUndefined,
  flowHelper,
  isCustomError,
  isNil,
  isQuotaError,
  isTrigger,
} from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EngineService } from '../../engine/engine.service'
import { FilesService } from '../../files/files.service'
import { ConnectorsMetadataService } from '../../flows/connectors/connectors-metadata/connectors-metadata.service'
import { FlowRunWatcherService } from '../../flows/flow-runs/flow-runs-watcher.service'
import { FlowRunsService } from '../../flows/flow-runs/flow-runs.service'
import { HookType } from '../../flows/flow-runs/types'
import { FlowVersionDocument, FlowVersionModel } from '../../flows/flow-versions/schemas/flow-version.schema'
import { FlowsService } from '../../flows/flows/flows.service'
import { SandboxProvisionerService } from '../sandbox/sandbox-provisioner.service'
import { Sandbox } from '../sandbox/sandboxes/sandbox'
import { FlowWorkerHooks } from './flow-worker.hooks'
import { logSerializer } from './log-serializer'
import { OneTimeJobData } from './queues/types'

type FinishExecutionParams = {
	flowRunId: Id
	logFileId: Id
	result: FlowRunResponse
}

type LoadInputAndLogFileIdParams = {
	flowVersion: FlowVersion
	jobData: OneTimeJobData
}

type LoadInputAndLogFileIdResponse = {
	input: Omit<BeginExecuteFlowOperation, 'serverUrl' | 'workerToken'> | Omit<ResumeExecuteFlowOperation, 'serverUrl' | 'workerToken'>
	logFileId?: Id | undefined
}

@Injectable()
export class FlowWorkerService {
	private readonly logger = new Logger(FlowWorkerService.name)

	constructor(
		@InjectModel(FlowVersionModel.name) private readonly flowVersionModel: Model<FlowVersionDocument>,
		private readonly flowsService: FlowsService,
		private readonly flowRunsService: FlowRunsService,
		private readonly flowWorkerHooks: FlowWorkerHooks,
		private readonly connectorsMetadataService: ConnectorsMetadataService,
		private readonly sandboxProvisionerService: SandboxProvisionerService,
		private readonly engineService: EngineService,
		private readonly filesService: FilesService,
		private readonly flowRunWatcherService: FlowRunWatcherService,
	) {}

	private async _loadInputAndLogFileId({ flowVersion, jobData }: LoadInputAndLogFileIdParams): Promise<LoadInputAndLogFileIdResponse> {
		const baseInput = {
			flowVersion,
			flowRunId: jobData.runId,
			projectId: jobData.projectId,
		}

		const flowRun = await this.flowRunsService.findOneWithSteps({
			id: jobData.runId,
			projectId: jobData.projectId,
		})
		assertNotNullOrUndefined(flowRun, 'flowRun')

		switch (jobData.executionType) {
			case ExecutionType.RESUME: {
				if (isNil(flowRun.logsFileId)) {
					throw new CustomError(`Can not find logfile`, ErrorCode.VALIDATION, {
						flowRunId: flowRun._id,
					})
				}

				return {
					input: {
						...baseInput,
						tasks: flowRun.tasks ?? 0,
						executionType: ExecutionType.RESUME,
						steps: flowRun.steps,
						resumePayload: jobData.payload as ResumePayload,
					},
					logFileId: flowRun.logsFileId.toString(),
				}
			}
			case ExecutionType.BEGIN:
				if (!isNil(flowRun.logsFileId)) {
					if (flowRun.status !== FlowRunStatus.INTERNAL_ERROR) {
						const trigger = Object.values(flowRun.steps).find((step) => isTrigger(step))
						assertNotNullOrUndefined(trigger, 'Trigger not found in execution state')
						jobData.payload = trigger.output
					}
				}
				return {
					input: {
						triggerPayload: jobData.payload,
						executionType: ExecutionType.BEGIN,
						...baseInput,
					},
				}
		}
	}

	private async _saveToLogFile({
		fileId,
		projectId,
		executionOutput,
	}: {
		fileId: Id | undefined
		projectId: Id
		executionOutput: ExecutioOutputFile
	}): Promise<File> {
		const serializedLogs = await logSerializer.serialize(executionOutput)

		if (serializedLogs.byteLength > MAX_LOG_SIZE) {
			throw new CustomError(`Execution Output is too large, maximum size is ${MAX_LOG_SIZE}`, ErrorCode.INVALID_TYPE)
			// const error = new Error('Execution Output is too large, maximum size is ' + MAX_LOG_SIZE)
			// exceptionHandler.handle(error)
			// throw error
		}

		const logsFile = await this.filesService.save({
			fileId,
			projectId,
			data: serializedLogs,
			type: FileType.FLOW_RUN_LOG,
			compression: FileCompression.GZIP,
		})

		return logsFile
	}

	private async _extractFlowConnector({ projectId, flowVersion }: ExtractFlowConnectorsParams): Promise<ConnectorPackage[]> {
		const connectors: ConnectorPackage[] = []
		const steps = flowHelper.getAllSteps(flowVersion)

		for (const step of steps) {
			if (step.type === TriggerType.CONNECTOR || step.type === ActionType.CONNECTOR) {
				const { packageType, connectorType, connectorName, connectorVersion } = step.settings
				connectors.push(
					await this.connectorsMetadataService.getConnectorPackage(projectId, {
						packageType,
						connectorType,
						connectorName,
						connectorVersion,
					}),
				)
			}
		}

		return connectors
	}

	private async _getSandbox({ projectId, flowVersion, runEnvironment }: GetSandboxParams): Promise<Sandbox> {
		const connectors = await this._extractFlowConnector({
			flowVersion,
			projectId,
		})

		// TODO implement code steps
		// const codeSteps = getCodeSteps(flowVersion)
		switch (runEnvironment) {
			case RunEnvironment.PRODUCTION:
				return this.sandboxProvisionerService.provision({
					type: SandBoxCacheType.FLOW,
					flowVersionId: flowVersion._id,
					connectors,
					// codeSteps,
				})
			case RunEnvironment.TESTING:
				return this.sandboxProvisionerService.provision({
					type: SandBoxCacheType.NONE,
					connectors,
					// codeSteps,
				})
		}
	}

	private _getTerminalStatus(status: FlowRunStatus): FlowRunStatus {
		return status == FlowRunStatus.STOPPED ? FlowRunStatus.SUCCEEDED : status
	}

	private _throwErrorToRetry(error: Error, runId: string) {
		// exceptionHandler.handle(error)
		this.logger.error(`#executeFlow Error executing flow run id: ${runId}`)
		this.logger.error(error)
		throw error
	}

	private async _finishExecution(params: FinishExecutionParams): Promise<void> {
		const { flowRunId, logFileId, result } = params

		this.logger.log(`#finishExecution params:`, {
			logFileId: logFileId,
			flowRunId: flowRunId,
			duration: result.duration,
			tasks: result.tasks,
			tags: result.tags,
			status: result.status,
		})


		if (result.status === FlowRunStatus.PAUSED) {
			await this.flowRunsService.pause({
				flowRunId,
				logFileId,
				pauseMetadata: result.pauseMetadata!,
			})
		} else {
			await this.flowRunsService.finish({
				flowRunId,
				status: this._getTerminalStatus(result.status),
				tasks: result.tasks,
				logsFileId: logFileId,
				tags: result.tags ?? [],
			})
		}
	}

	async executeFlow(jobData: OneTimeJobData): Promise<void> {
		this.logger.debug(`#executeFlow flowRunId=${jobData.runId} executionType=${jobData.executionType}`)

		const startTime = Date.now()

		const flowVersionWithLockedConnectors = await this.flowVersionModel.findOne({
			_id: jobData.flowVersionId,
		})

		if (isNil(flowVersionWithLockedConnectors)) {
			this.logger.debug(`Flow version not found, skipping execution flowVersion=${jobData.flowVersionId}`)
			return
		}

		// TODO implement locking flowVersions
		// 	const flowVersion = await flowVersionService.lockConnectorVersions({
		// 		projectId: jobData.projectId,
		// 		flowVersion: flowVersionWithLockedConnectors,
		// })

		try {
			const { input, logFileId } = await this._loadInputAndLogFileId({
				flowVersion: flowVersionWithLockedConnectors.toObject(),
				jobData,
			})

			await this.flowWorkerHooks.preExecute({
				projectId: jobData.projectId,
				runId: jobData.runId,
			})

			const sandbox = await this._getSandbox({
				projectId: jobData.projectId,
				flowVersion: flowVersionWithLockedConnectors.toObject(),
				runEnvironment: jobData.environment,
			})

			this.logger.debug(`#executeFlow flowRunId=${jobData.runId} sandboxId=${sandbox.boxId} prepareTime=${Date.now() - startTime}ms`)

			const { result } = await this.engineService.executeFlow(sandbox, input)

			if (jobData.synchronousHandlerId && jobData.hookType === HookType.BEFORE_LOG) {
				await this.flowRunWatcherService.publish(jobData.runId, jobData.synchronousHandlerId, result)
			}

			const logsFile = await this._saveToLogFile({
				fileId: logFileId,
				projectId: jobData.projectId,
				executionOutput: {
					executionState: {
						steps: result.steps,
					},
				},
			})

			await this._finishExecution({
				flowRunId: jobData.runId,
				logFileId: logsFile._id,
				result,
			})

			if (jobData.synchronousHandlerId && jobData.hookType === HookType.AFTER_LOG) {
				await this.flowRunWatcherService.publish(jobData.runId, jobData.synchronousHandlerId, result)
			}

			this.logger.log(
				`#executeFlow flowRunId=${jobData.runId} FlowRunResponseStatus=${result.status} sandboxId=${sandbox.boxId} duration=${
					Date.now() - startTime
				} ms`,
			)
		} catch (error: unknown) {
			if (isQuotaError(error)) {
				this.logger.log(`#executeFlow removing flow.id=${flowVersionWithLockedConnectors.flowId}, exceeded tasks limit`)
				await this.flowsService.changeStatus({
					newStatus: FlowStatus.DISABLED,
					id: flowVersionWithLockedConnectors.flowId.toString(),
					projectId: jobData.projectId,
				})

				await this.flowRunsService.finish({
					flowRunId: jobData.runId,
					status: FlowRunStatus.QUOTA_EXCEEDED_TASKS,
					tasks: 0,
					logsFileId: null,
					tags: [],
				})
			} else if (isCustomError(error) && error.code === ErrorCode.EXECUTION_TIMEOUT) {
				await this.flowRunsService.finish({
					flowRunId: jobData.runId,
					status: FlowRunStatus.TIMEOUT,
					// TODO REVIST THIS
					tasks: 10,
					logsFileId: null,
					tags: [],
				})
			} else {
				this.logger.error(`#executeFlow`, error)
				await this.flowRunsService.finish({
					flowRunId: jobData.runId,
					status: FlowRunStatus.INTERNAL_ERROR,
					// TODO revisit it if it should be set to 0 ?
					tasks: 0,
					logsFileId: null,
					tags: [],
				})
				this._throwErrorToRetry(error as Error, jobData.runId)
			}
		}
	}
}

type GetSandboxParams = {
	projectId: Id
	flowVersion: FlowVersion
	runEnvironment: RunEnvironment
}

type ExtractFlowConnectorsParams = {
	flowVersion: FlowVersion
	projectId: Id
}
