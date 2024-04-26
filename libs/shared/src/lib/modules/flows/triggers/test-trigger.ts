import { Id } from '../../../common'
import { StepNameType } from '../../../common/type-validators'

export enum TriggerTestStrategy {
	SIMULATION = 'SIMULATION',
	TEST_FUNCTION = 'TEST_FUNCTION',
}

export interface TestTriggerRequestBody {
	flowId: Id
	flowVersionId: Id
	testStrategy: TriggerTestStrategy
	triggerName: StepNameType
}
