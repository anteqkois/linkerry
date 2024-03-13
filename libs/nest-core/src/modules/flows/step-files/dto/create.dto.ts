import { StepFileUpsertInput } from '@linkerry/shared'

export class CreateDto implements StepFileUpsertInput {
	name: string
	flowId: string
	stepName: string
	file: unknown
}
