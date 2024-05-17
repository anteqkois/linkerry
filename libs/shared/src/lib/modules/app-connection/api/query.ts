import { z } from 'zod'
import { connectorNameSchema } from '../../../common/zod'

export const appCpnnectionsGetManyQuerySchema = z.object({
  connectorName: connectorNameSchema.optional(),
})
export interface AppCpnnectionsGetManyQuery extends z.infer<typeof appCpnnectionsGetManyQuerySchema> {}
