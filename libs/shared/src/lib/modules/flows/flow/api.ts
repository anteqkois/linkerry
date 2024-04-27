import { z } from 'zod'
import { Id } from '../../../common'
import { triggerSchemaPartial } from '../triggers/trigger'
import { FlowStatus } from './flow'

export const flowGetManyQuerySchema = z.object({})
export interface FlowGetManyQuery extends z.infer<typeof flowGetManyQuerySchema> {}

export const flowGetOneQuerySchema =z.object({})
export interface FlowGetOneQuery extends z.infer<typeof flowGetOneQuerySchema>{}

export const flowUpdateTreiggerBodySchema = triggerSchemaPartial
export type FlowUpdateTreiggerBody = z.infer<typeof flowUpdateTreiggerBodySchema>

export interface FlowPublishInput {
	flowVersionId: Id
}

export interface UpdateStatusInput {
	id: Id
	projectId: Id
	newStatus: FlowStatus
}

export interface DeleteInput {
	id: Id
	projectId: Id
}

export interface FlowPatchResponse {}
