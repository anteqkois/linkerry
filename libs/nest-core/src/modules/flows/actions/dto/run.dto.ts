import { Id, RunActionInput } from '@linkerry/shared'
import { IsDefined } from 'class-validator'

export class RunActionDto implements RunActionInput {
	@IsDefined()
	flowVersionId: Id

	@IsDefined()
	actionName: string
}
