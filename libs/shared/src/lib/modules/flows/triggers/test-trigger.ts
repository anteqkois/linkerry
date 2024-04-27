import { z } from 'zod'
import { idSchema, stepNameSchema } from '../../../common/zod'

export enum TriggerTestStrategy {
	SIMULATION = 'SIMULATION',
	TEST_FUNCTION = 'TEST_FUNCTION',
}

export const testTriggerRequestBodySchema = z.object({
	flowId: idSchema,
	flowVersionId: idSchema,
	testStrategy: z.nativeEnum(TriggerTestStrategy),
	triggerName: stepNameSchema,
})
export interface TestTriggerRequestBody extends z.infer<typeof testTriggerRequestBodySchema> {}
