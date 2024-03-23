import { Id } from '../../../common'
import { Action } from '../actions'
import { Trigger } from '../triggers'
import { FlowStatus } from './flow'

export enum FlowOperationType {
	LOCK_AND_PUBLISH = 'LOCK_AND_PUBLISH',
	CHANGE_STATUS = 'CHANGE_STATUS',
	// LOCK_FLOW = 'LOCK_FLOW',
	// CHANGE_FOLDER = 'CHANGE_FOLDER',
	CHANGE_NAME = 'CHANGE_NAME',
	// MOVE_ACTION = 'MOVE_ACTION',
	// IMPORT_FLOW = 'IMPORT_FLOW',
	UPDATE_TRIGGER = 'UPDATE_TRIGGER',
	ADD_ACTION = 'ADD_ACTION',
	UPDATE_ACTION = 'UPDATE_ACTION',
	DELETE_ACTION = 'DELETE_ACTION',
	// DUPLICATE_ACTION = 'DUPLICATE_ACTION',
	// USE_AS_DRAFT = 'USE_AS_DRAFT',
}

export enum StepLocationRelativeToParent {
	INSIDE_TRUE_BRANCH = 'INSIDE_TRUE_BRANCH',
	INSIDE_FALSE_BRANCH = 'INSIDE_FALSE_BRANCH',
	AFTER = 'AFTER',
	INSIDE_LOOP = 'INSIDE_LOOP',
}

// const optionalNextAction = Type.Object({ nextAction: Type.Optional(Action) })

// export const UseAsDraftRequest = Type.Object({
//     versionId: Type.String(),
// })
// export type UseAsDraftRequest = Static<typeof UseAsDraftRequest>

export type LockFlowRequest = {
	//
}

// export const ImportFlowRequest = Type.Object({
//     displayName: Type.String({}),
//     trigger: Type.Union([Type.Composite([PieceTrigger, optionalNextAction]), Type.Composite([EmptyTrigger, optionalNextAction])]),
// })

// export type ImportFlowRequest = Static<typeof ImportFlowRequest>

// export const ChangeFolderRequest = Type.Object({
// folderId: Nullable(Type.String({})),
// })

// export type ChangeFolderRequest = Static<typeof ChangeFolderRequest>

export type ChangeNameRequest = {
	displayName: string
}

export type DeleteActionRequest = {
	name: string
}

// export const UpdateActionRequest = Type.Union([CodeActionSchema, LoopOnItemsActionSchema, PieceActionSchema, BranchActionSchema])
export type UpdateActionRequest = Action

// export const DuplicateStepRequest = Type.Object({
// 	stepName: Type.String(),
// })

// export type DuplicateStepRequest = Static<typeof DuplicateStepRequest>

// export const MoveActionRequest = Type.Object({
// 	name: Type.String(),
// 	newParentStep: Type.String(),
// 	stepLocationRelativeToNewParent: Type.Optional(Type.Enum(StepLocationRelativeToParent)),
// })
// export type MoveActionRequest = Static<typeof MoveActionRequest>

export type AddActionRequest = {
	parentStepName: string
	// stepLocationRelativeToParent: StepLocationRelativeToParent
	action: UpdateActionRequest
}

export type UpdateTriggerRequest = Trigger

export type UpdateFlowStatusRequest = {
	status: FlowStatus
}

export type ChangePublishedVersionIdRequest = {
	//
}

export type FlowOperationRequest =
	// | {
	// 		type: FlowOperationType.MOVE_ACTION
	// 		request: MoveActionRequest
	//   }
	| {
			flowVersionId: Id
			type: FlowOperationType.CHANGE_STATUS
			request: UpdateFlowStatusRequest
	  }
	| {
			flowVersionId: Id
			type: FlowOperationType.LOCK_AND_PUBLISH
			request: ChangePublishedVersionIdRequest
	  }
	// | {
	// 		type: FlowOperationType.USE_AS_DRAFT
	// 		request: UseAsDraftRequest
	//   }
	// | {
	// 		flowVersionId: Id
	// 		type: FlowOperationType.LOCK_FLOW
	// 		request: LockFlowRequest
	//   }
	// | {
	// 		type: FlowOperationType.IMPORT_FLOW
	// 		request: ImportFlowRequest
	//   }
	| {
			flowVersionId: Id
			type: FlowOperationType.CHANGE_NAME
			request: ChangeNameRequest
	  }
	| {
			flowVersionId: Id
			type: FlowOperationType.DELETE_ACTION
			request: DeleteActionRequest
	  }
	| {
			flowVersionId: Id
			type: FlowOperationType.UPDATE_ACTION
			request: UpdateActionRequest
	  }
	| {
			flowVersionId: Id
			type: FlowOperationType.ADD_ACTION
			request: AddActionRequest
	  }
	| {
			flowVersionId: Id
			type: FlowOperationType.UPDATE_TRIGGER
			request: UpdateTriggerRequest
	  }
// | {
// 		type: FlowOperationType.CHANGE_FOLDER
// 		request: ChangeFolderRequest
//   }
// | {
// 		type: FlowOperationType.DUPLICATE_ACTION
// 		request: DuplicateStepRequest
//   }
