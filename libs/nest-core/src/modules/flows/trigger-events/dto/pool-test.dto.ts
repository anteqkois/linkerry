import { Id } from "@market-connector/shared";
import { IsDefined } from "class-validator";

export class PoolTestDto {
	@IsDefined()
	flowId: Id

	@IsDefined()
	triggerName: string
}
