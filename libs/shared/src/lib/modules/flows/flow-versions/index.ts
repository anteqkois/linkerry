import { BaseDatabaseFields, Id } from '../../../common'
import { Action } from '../actions'
import { Flow } from '../flow/flow'
import { Trigger } from '../triggers'

export enum FlowVersionState {
	DRAFT = 'DRAFT',
	LOCKED = 'LOCKED',
}

export interface FlowVersion extends BaseDatabaseFields {
	_id: Id
	flowId: Id
	flow?: Flow
	projectId: Id
	displayName: string
	triggers: Trigger[]
	actions: Action[]
	valid: boolean
	state: FlowVersionState
	stepsCount: number
	updatedBy: Id
}
