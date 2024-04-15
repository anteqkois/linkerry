import { Id } from '../../common'

export interface FlowRunWSInput {
	projectId: Id
	flowVersionId: Id
}

export interface FlowRunsGetManyQuery {
	flowId?: Id
	fromDate?: string
}
