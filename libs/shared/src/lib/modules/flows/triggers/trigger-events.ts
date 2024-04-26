import { DatabaseTimestamp, Id } from '../../../common'
import { ShortStringType, StepNameType } from '../../../common/type-validators'
import { FlowVersion } from '../flow-versions'

export interface TriggerEvent extends DatabaseTimestamp {
	_id: Id
	flowId: Id
	projectId: Id
	sourceName: ShortStringType //'@linkerry/connector-google-sheets@~0.7.4:new_row'
	payload: any
}

export interface TriggerTestPoolResponse {
	triggerEvents: TriggerEvent[]
	flowVersion: FlowVersion
}

export interface WatchTriggerEventsWSInput {
	flowId: Id
	triggerName: StepNameType
}

export type WatchTriggerEventsWSResponse =
	| {
			triggerEvents: TriggerEvent[]
			flowVersion: FlowVersion
	  }
	| string
