import { Nullable } from '../../../common'
import { DatabaseTimestamp, Id } from '../../../common/database'
import { ShortStringType } from '../../../common/type-validators'
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
	cronExpression:ShortStringType
	timezone: ShortStringType
}

export interface Flow extends DatabaseTimestamp {
	_id: Id
	projectId: Id
	// folderId: Id
	version: FlowVersion | Id
	status: FlowStatus
	publishedVersionId: Nullable<Id>
	schedule: Nullable<FlowScheduleOptions>
	deleted: boolean
}

export interface FlowPopulated extends Omit<Flow, 'version'> {
	version: FlowVersion
}
