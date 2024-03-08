import { Id, TimestampDatabase } from '../../../common'
import { Action } from '../actions'
import { Trigger } from '../triggers'

export enum FlowVersionState {
	DRAFT = 'DRAFT',
	LOCKED = 'LOCKED',
}

export interface FlowVersion extends TimestampDatabase {
	_id: Id
	flow: Id
	projectId: Id
	displayName: string
	triggers: Trigger[]
	actions: Action[]
	valid: boolean
	state: FlowVersionState
	stepsCount: number
	updatedBy: Id
}
