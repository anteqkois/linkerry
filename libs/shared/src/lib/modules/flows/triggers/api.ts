import { Id } from "../../../common"

export interface TriggerPoolTestBody {
	flowId: Id
	triggerName: string
}

export interface GetTriggerEventsQuery {
	flowId: Id
	triggerName: string
}
