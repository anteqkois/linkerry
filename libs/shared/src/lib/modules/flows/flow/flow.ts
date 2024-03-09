import { Nullable } from '../../../common'
import { Id, TimestampDatabase } from '../../../common/database'
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

export interface Flow extends TimestampDatabase {
	_id: Id
	projectId: Id
	// folderId: Id
	version: FlowVersion | Id
	status: FlowStatus
	publishedVersionId: Nullable<Id>
	schedule: Nullable<FlowScheduleOptions>
}

export interface FlowPopulated extends Omit<Flow, 'version'> {
	version: FlowVersion
}
