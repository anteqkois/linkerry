import { Nullable } from '../../../common'
import { BaseDatabaseFields, Id } from '../../../common/database'
import { FlowVersion } from '../flow-versions'

export enum FlowStatus {
	ENABLED = 'ENABLED',
	DISABLED = 'DISABLED',
}

export enum ScheduleType {
	CRON_EXPRESSION = 'CRON_EXPRESSION',
}

export interface FlowScheduleOptions {
	type: ScheduleType
	cronExpression: string
	timezone: string
}

export interface Flow extends BaseDatabaseFields {
	_id: Id
	projectId: Id
	// folderId: Id
	flowVersionId: Id
	version?: FlowVersion
	status: FlowStatus
	publishedVersionId: Nullable<Id>
	schedule: Nullable<FlowScheduleOptions>
	deleted: boolean
}

export interface FlowPopulated extends Omit<Flow, 'version'> {
	version: FlowVersion
}
