import { z } from 'zod'
import { DatabaseTimestamp, idStringSchema } from '../../../common'

export const stepFileSchema = z.object({
	_id: z.string(),
	name: z.string(),
	flowId: idStringSchema,
	stepName: z.string(),
	size: z.number(),
	data: z.any()
})

export interface StepFile extends z.infer<typeof stepFileSchema>, DatabaseTimestamp {}
