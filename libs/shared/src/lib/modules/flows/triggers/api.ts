import { Id } from "../../../common"
import { StepNameType } from "../../../common/type-validators"

export interface TriggerPoolTestBody {
	flowId: Id
	triggerName: StepNameType
}

export interface GetManyTriggerEventsQuery {
	flowId: Id
	triggerName: StepNameType
}

export interface DeleteTriggerEventsInput {
	flowId: Id
	triggerName: StepNameType
}
