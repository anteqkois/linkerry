import { z } from 'zod'
import { idSchema, stringShortSchema } from '../../../common/zod'
import { FlowVersion } from '../flow-versions'

export const runActionInputSchema = z.object({
	flowVersionId: idSchema,
	actionName: stringShortSchema,
})
export interface RunActionInput extends z.infer<typeof runActionInputSchema>{}

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
