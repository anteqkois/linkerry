import { Id } from '../../common'
import { DateType } from '../../common/type-validators'

export interface FlowRunWSInput {
	projectId: Id
	flowVersionId: Id
}

export interface FlowRunsGetManyQuery {
	flowId?: Id
	fromDate?: DateType
}
