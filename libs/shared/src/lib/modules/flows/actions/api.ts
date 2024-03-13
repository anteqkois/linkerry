import { Id } from '../../../common'
import { FlowVersion } from '../flow-versions'

export interface RunActionInput {
	flowVersionId: Id
	actionName: string
}

type RunActionBaseResponse = {
	success: boolean
	output: unknown
	standardError: string
	standardOutput: string
}

type RunActionSuccessResponse = RunActionBaseResponse & {
	success: true
	flowVersion: FlowVersion
}

type RunActionFailureResponse = RunActionBaseResponse & {
	success: false
}

export type RunActionResponse = RunActionSuccessResponse | RunActionFailureResponse
