import { Id } from '../../../common'
import { FlowVersion } from '../flow-versions'

export interface RunActionInput {
	flowVersionId: Id
	actionName: string
}

export interface RunActionResponse {
	success: boolean
	output: unknown
	standardError: string
	standardOutput: string
	flowVersion: FlowVersion
}
