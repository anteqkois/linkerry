import { z } from 'zod'
import { BaseDatabaseFields } from '../../../common'
import { idSchema, stringShortSchema } from '../../../common/zod'

export const stepFileSchema = z.object({
  _id: z.string(),
  flowId: idSchema,
  projectId: idSchema,
  name: z.string(),
  size: z.number(),
  stepName: z.string(),
  data: z.any(),
})
export type StepFile = BaseDatabaseFields & z.infer<typeof stepFileSchema>

export const stepFileUpsertInputSchema = z.object({
  name: stringShortSchema,
  flowId: idSchema,
  stepName: stringShortSchema,
  file: z.unknown(),
})
export type StepFileUpsertInput = z.infer<typeof stepFileUpsertInputSchema>

export const stepFileGetSchema = z.object({
  id: stringShortSchema,
  projectId: idSchema,
})
export type StepFileGet = z.infer<typeof stepFileGetSchema>
