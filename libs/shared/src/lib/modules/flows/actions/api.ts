import { Id } from '../../../common'

export interface RunActionInput {
	flowVersionId: Id
	actionName: string
}

export interface RunActionResponse {
	success: boolean
	output: unknown
	standardError: string
	standardOutput: string
}
