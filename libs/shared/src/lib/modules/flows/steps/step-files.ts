import { z } from 'zod'
import { DatabaseTimestamp, idStringSchema } from '../../../common'

export const stepFileSchema = z.object({
	_id: z.string(),
	flowId: idStringSchema,
	projectId: idStringSchema,
	name: z.string(),
	size: z.number(),
	stepName: z.string(),
	data: z.any(),
})

export interface StepFile extends z.infer<typeof stepFileSchema>, DatabaseTimestamp {}

export interface StepFileUpsertInput {
	name: string
	flowId: string
	stepName: string
	file: unknown
}

export interface StepFileGet {
	id: string
	projectId: string
}
