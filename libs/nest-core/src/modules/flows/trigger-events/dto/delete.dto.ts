import { DeleteTriggerEventsInput, Id } from "@linkerry/shared";
import { IsDefined } from "class-validator";

export class DeleteDto implements DeleteTriggerEventsInput{
	@IsDefined()
	flowId: Id

	@IsDefined()
	triggerName: string
}
