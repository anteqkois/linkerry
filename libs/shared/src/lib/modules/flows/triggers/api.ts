import { z } from 'zod'
import { idSchema, stepNameSchema, stringShortSchema } from '../../../common/zod'

export const triggerPoolTestBodySchema = z.object({
	flowId: idSchema,
	triggerName: stepNameSchema,
})
export interface TriggerPoolTestBody extends z.infer<typeof triggerPoolTestBodySchema> {}

export const getTriggerEventsQuerySchema = z.object({
	flowId: idSchema,
	triggerName: stepNameSchema,
})
export interface GetTriggerEventsQuery extends z.infer<typeof getTriggerEventsQuerySchema> {}

export const deleteTriggerEventsInputSchema = z.object({
	flowId: idSchema,
	triggerName: stringShortSchema,
})
export interface DeleteTriggerEventsInput extends z.infer<typeof deleteTriggerEventsInputSchema> {}
