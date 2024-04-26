import { DatabaseTimestamp, Id } from '../../../common'
import { ShortStringType } from '../../../common/type-validators'
import { Action } from '../actions'
import { Trigger } from '../triggers'

export enum FlowVersionState {
	DRAFT = 'DRAFT',
	LOCKED = 'LOCKED',
}

export interface FlowVersion extends DatabaseTimestamp {
	_id: Id
	flow: Id
	projectId: Id
	displayName: ShortStringType
	triggers: Trigger[]
	actions: Action[]
	valid: boolean
	state: FlowVersionState
	stepsCount: number
	updatedBy: Id
}
