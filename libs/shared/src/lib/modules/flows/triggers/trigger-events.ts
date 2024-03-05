import { Id, TimestampDatabase } from '../../../common'
import { FlowVersion } from '../flow-versions'

export interface TriggerEvent extends TimestampDatabase {
	_id: Id
	flowId: Id
	projectId: Id
	sourceName: string	//'@linkerry/connector-google-sheets@~0.7.4:new_row'
	payload: any
}

export interface TriggerTestPoolResponse {
	triggerEvents: TriggerEvent[]
	flowVersion: FlowVersion
}
