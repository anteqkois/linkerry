import { GetTriggerEventsQuery, Id } from "@linkerry/shared";
import { IsDefined } from "class-validator";

export class GetManyDto implements GetTriggerEventsQuery{
	@IsDefined()
	flowId: Id

	@IsDefined()
	triggerName: string
}
