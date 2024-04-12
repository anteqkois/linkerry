import { ExecutionState } from './execution-output'

export enum FlowRunStatus {
	FAILED = 'FAILED',
	QUOTA_EXCEEDED_TASKS = 'QUOTA_EXCEEDED_TASKS',
	INTERNAL_ERROR = 'INTERNAL_ERROR',
	PAUSED = 'PAUSED',
	RUNNING = 'RUNNING',
	STOPPED = 'STOPPED',
	SUCCEEDED = 'SUCCEEDED',
	TIMEOUT = 'TIMEOUT',
}

export enum PauseType {
	DELAY = 'DELAY',
	WEBHOOK = 'WEBHOOK',
}

export type DelayPauseMetadata = {
	type: PauseType.DELAY
	resumeDateTime: string
}

export type WebhookPauseMetadata = {
	type: PauseType.WEBHOOK
	requestId: string
	response: unknown
}

export type PauseMetadata = DelayPauseMetadata | WebhookPauseMetadata

export type StopResponse = {
	status?: number
	body?: unknown
	headers?: Record<string, string>
}

type BaseExecutiionResponse = ExecutionState & {
	duration: number
	tasks: number
	tags?: string[]
	error?: {
		stepName: string
		message: string
	}
	stopResponse?: StopResponse
}

export type FlowRunResponse = (
	| ({
			status: FlowRunStatus.PAUSED
			pauseMetadata?: PauseMetadata
	  } & BaseExecutiionResponse)
	| ({
			status:
				| FlowRunStatus.FAILED
				| FlowRunStatus.SUCCEEDED
				| FlowRunStatus.RUNNING
				| FlowRunStatus.QUOTA_EXCEEDED_TASKS
				| FlowRunStatus.TIMEOUT
				| FlowRunStatus.INTERNAL_ERROR
				| FlowRunStatus.STOPPED
	  } & BaseExecutiionResponse)
) &
	ExecutionState
