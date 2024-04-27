import { z } from 'zod'
import { BaseDatabaseFields } from '../../../common'
import { idSchema, stepNameSchema, stringShortSchema } from '../../../common/zod'

export const stepFileSchema = z.object({
	_id: z.string(),
	flowId: idSchema,
	projectId: idSchema,
	name: z.string(),
	size: z.number(),
	stepName: z.string(),
	data: z.any(),
})
export interface StepFile extends BaseDatabaseFields, z.infer<typeof stepFileSchema> {}

export const stepFileUpsertInputSchema = z.object({
	name: stringShortSchema,
	flowId: idSchema,
	stepName: stepNameSchema,
	file: z.unknown()
})
export interface StepFileUpsertInput extends z.infer<typeof stepFileUpsertInputSchema> {}

export const stepFileGetSchema = z.object({
	id: stringShortSchema,
	projectId: idSchema
})
export interface StepFileGet extends z.infer<typeof stepFileGetSchema>{}
