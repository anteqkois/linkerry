import { Id } from "@linkerry/shared";
import { IsDefined } from "class-validator";

export class PoolTestDto {
	@IsDefined()
	flowId: Id

	@IsDefined()
	triggerName: string
}
