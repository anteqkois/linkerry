import { Id, TriggerPoolTestBody } from "@linkerry/shared";
import { IsDefined } from "class-validator";

export class TestDto implements TriggerPoolTestBody{
	@IsDefined()
	flowId: Id

	@IsDefined()
	triggerName: string
}
