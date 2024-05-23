import { z } from 'zod'
import { BaseDatabaseFields, Id } from '../../common'
import { idSchema } from '../../common/zod'

export interface WebhookSimulation extends BaseDatabaseFields {
  _id: Id
  flowId: Id
  projectId: Id
}

export const getWebhookSimulationQuerySchema = z.object({
  flowId: idSchema,
})
export interface GetWebhookSimulationQuery extends z.infer<typeof getWebhookSimulationQuerySchema> {}

export const createWebhookSimulationInputSchema = z.object({
  flowId: idSchema,
})
export interface CreateWebhookSimulationInput extends z.infer<typeof createWebhookSimulationInputSchema> {}

export const deleteWebhookSimulationInputSchema = z.object({
  flowId: idSchema,
})
export interface DeleteWebhookSimulationInput extends z.infer<typeof deleteWebhookSimulationInputSchema> {}
