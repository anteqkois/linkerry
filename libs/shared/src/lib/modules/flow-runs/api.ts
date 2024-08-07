import { z } from 'zod'
import { Id } from '../../common'
import { idSchema, stringDateSchema } from '../../common/zod'

export interface FlowRunWSInput {
  projectId: Id
  flowVersionId: Id
}

export const flowRunsGetManyQuerySchema = z.object({
  flowId: idSchema.optional(),
  fromDate: stringDateSchema.optional(),
})
export type FlowRunsGetManyQuery = z.infer<typeof flowRunsGetManyQuerySchema>
