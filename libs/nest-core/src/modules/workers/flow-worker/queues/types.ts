import { ExecutionType, FlowRetryPayload, Id, RunEnvironment, ScheduleOptions, TriggerType } from '@linkerry/shared'

export const repeatingJobKey = (id: Id): string => `linkerry:repeatJobKey:${id}`

export const LATEST_JOB_DATA_SCHEMA_VERSION = 1

export enum HookType {
	BEFORE_LOG = 'BEFORE_LOG',
	AFTER_LOG = 'AFTER_LOG',
}

export const QUEUES = {
	NAMES: {
		ONE_TIME_JOB_QUEUE: 'ONE_TIME_JOB_QUEUE',
		SCHEDULED_JOB_QUEUE: 'SCHEDULED_JOB_QUEUE',
	},
	CONFIG_KEYS: {
		FLOW: 'FLOW',
	},
}

export enum RepeatableJobType {
	RENEW_WEBHOOK = 'RENEW_WEBHOOK',
	EXECUTE_TRIGGER = 'EXECUTE_TRIGGER',
	DELAYED_FLOW = 'DELAYED_FLOW',
}

type BaseJobData = {
	projectId: Id
	environment: RunEnvironment
}

// Never change without increasing LATEST_JOB_DATA_SCHEMA_VERSION, and adding a migration
export type RenewWebhookJobData = {
	schemaVersion: number
	projectId: Id
	flowVersionId: Id
	flowId: Id
	jobType: RepeatableJobType.RENEW_WEBHOOK
}

// Never change without increasing LATEST_JOB_DATA_SCHEMA_VERSION, and adding a migration
export type RepeatingJobData = BaseJobData & {
	schemaVersion: number
	flowVersionId: Id
	flowId: Id
	triggerType: TriggerType
	jobType: RepeatableJobType.EXECUTE_TRIGGER
}

// Never change without increasing LATEST_JOB_DATA_SCHEMA_VERSION, and adding a migration
export type DelayedJobData = BaseJobData & {
	schemaVersion: number
	flowVersionId: Id
	runId: Id
	jobType: RepeatableJobType.DELAYED_FLOW
}

export type ScheduledJobData = RepeatingJobData | DelayedJobData | RenewWebhookJobData

export type OneTimeJobData = BaseJobData & {
	flowVersionId: Id
	runId: Id
	synchronousHandlerId?: string
	payload: unknown
	executionType: ExecutionType
	retryPayload?: FlowRetryPayload
	hookType?: HookType
}

export type JobData = ScheduledJobData | OneTimeJobData

export enum JobType {
	ONE_TIME = 'ONE_TIME',
	REPEATING = 'REPEATING',
	DELAYED = 'DELAYED',
}

export type BaseAddParams<JT extends JobType, JD extends JobData> = {
	id: Id
	type: JT
	data: JD
}

export type RepeatingJobAddParams<JT extends JobType.REPEATING> = BaseAddParams<JT, RepeatingJobData> & {
	scheduleOptions: ScheduleOptions
}

export type RenewWebhookJobAddParams<JT extends JobType.REPEATING> = BaseAddParams<JT, RenewWebhookJobData> & {
	scheduleOptions: ScheduleOptions
}

export type DelayedJobAddParams<JT extends JobType.DELAYED> = BaseAddParams<JT, DelayedJobData> & {
	delay: number
}

export type OneTimeJobAddParams<JT extends JobType.ONE_TIME> = BaseAddParams<JT, OneTimeJobData> & {
	priority: 'high' | 'medium'
}

export type AddParams<JT extends JobType> = JT extends JobType.ONE_TIME
	? OneTimeJobAddParams<JT>
	: JT extends JobType.REPEATING
	? RepeatingJobAddParams<JT> | RenewWebhookJobAddParams<JT>
	: JT extends JobType.DELAYED
	? DelayedJobAddParams<JT>
	: never

export type RemoveParams = {
	id: Id
}
