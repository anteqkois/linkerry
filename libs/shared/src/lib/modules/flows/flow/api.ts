import { Id } from '../../../common'
import { Trigger } from '../triggers/trigger'
import { FlowStatus } from './flow'

export interface FlowGetManyQuery {}

export interface FlowGetOneQuery {}

export type FlowUpdateTreiggerBody = Partial<Trigger>

export interface FlowPublishInput {
	flowVersionId: Id
}

export interface UpdateStatusInput  {
	newStatus: FlowStatus
}

export interface DeleteInput  {
	id: Id
	projectId: Id
}

export interface FlowPatchResponse {}
