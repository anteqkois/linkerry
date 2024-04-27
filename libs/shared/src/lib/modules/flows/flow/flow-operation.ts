import { z } from 'zod'
import { flowStepNameSchema, idSchema, stringShortSchema } from '../../../common/zod'
import { actionSchema } from '../actions'
import { triggerSchema } from '../triggers'
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

export const lockFlowRequestSchema = z.object({})
export type LockFlowRequest = z.infer<typeof lockFlowRequestSchema>

// export const ImportFlowRequest = Type.Object({
//     displayName: Type.String({}),
//     trigger: Type.Union([Type.Composite([PieceTrigger, optionalNextAction]), Type.Composite([EmptyTrigger, optionalNextAction])]),
// })

// export type ImportFlowRequest = Static<typeof ImportFlowRequest>

// export const ChangeFolderRequest = Type.Object({
// folderId: Nullable(Type.String({})),
// })

// export type ChangeFolderRequest = Static<typeof ChangeFolderRequest>

export const changeNameRequestSchema = z.object({
	displayName: stringShortSchema,
})
export type ChangeNameRequest = z.infer<typeof changeNameRequestSchema>

export const deleteActionRequestSchema = z.object({
	name: stringShortSchema,
})
export type DeleteActionRequest = z.infer<typeof deleteActionRequestSchema>

// export const UpdateActionRequest = Type.Union([CodeActionSchema, LoopOnItemsActionSchema, PieceActionSchema, BranchActionSchema])
export const updateActionRequestSchema = actionSchema
export type UpdateActionRequest = z.infer<typeof updateActionRequestSchema>

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

export const addActionRequestSchema = z.object({
	parentStepName: flowStepNameSchema,
	// stepLocationRelativeToParent: StepLocationRelativeToParent
	action: updateActionRequestSchema,
})
export type AddActionRequest = z.infer<typeof addActionRequestSchema>

export const updateTriggerRequestSchema = triggerSchema
export type UpdateTriggerRequest = z.infer<typeof updateTriggerRequestSchema>

export const updateFlowStatusRequestSchema = z.object({
	status: z.nativeEnum(FlowStatus),
})
export type UpdateFlowStatusRequest = z.infer<typeof updateFlowStatusRequestSchema>

export const changePublishedVersionIdRequestSchema = z.object({})
export type ChangePublishedVersionIdRequest = z.infer<typeof changePublishedVersionIdRequestSchema>

export const flowOperationRequestSchema = z.union([
	// | {
	// 		type: FlowOperationType.MOVE_ACTION
	// 		request: MoveActionRequest
	//   }
	z.object({
		flowVersionId: idSchema,
		type: z.enum([FlowOperationType.CHANGE_STATUS]),
		request: updateFlowStatusRequestSchema,
	}),
	z.object({
		flowVersionId: idSchema,
		type: z.enum([FlowOperationType.LOCK_AND_PUBLISH]),
		request: changePublishedVersionIdRequestSchema,
	}),
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
	z.object({
		flowVersionId: idSchema,
		type: z.enum([FlowOperationType.CHANGE_NAME]),
		request: changeNameRequestSchema,
	}),
	z.object({
		flowVersionId: idSchema,
		type: z.enum([FlowOperationType.DELETE_ACTION]),
		request: deleteActionRequestSchema,
	}),
	z.object({
		flowVersionId: idSchema,
		type: z.enum([FlowOperationType.UPDATE_ACTION]),
		request: updateActionRequestSchema,
	}),
	z.object({
		flowVersionId: idSchema,
		type: z.enum([FlowOperationType.ADD_ACTION]),
		request: addActionRequestSchema,
	}),
	z.object({
		flowVersionId: idSchema,
		type: z.enum([FlowOperationType.UPDATE_TRIGGER]),
		request: updateTriggerRequestSchema,
	}),
	// | {
	// 		type: FlowOperationType.CHANGE_FOLDER
	// 		request: ChangeFolderRequest
	//   }
	// | {
	// 		type: FlowOperationType.DUPLICATE_ACTION
	// 		request: DuplicateStepRequest
	//   }
])

export type FlowOperationRequest = z.infer<typeof flowOperationRequestSchema>
