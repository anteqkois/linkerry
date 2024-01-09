import { clone } from '../../../common'
import { Action, ActionType } from '../steps/action'
import { Trigger, TriggerType } from '../steps/trigger'
import { FlowVersion } from './flow'

type Step = Action | Trigger

function isValid(flowVersion: FlowVersion) {
	let valid = true
	const steps = flowHelper.getAllSteps(flowVersion)
	for (let i = 0; i < steps.length; i++) {
		const step = steps[i]
		valid = valid && step.valid
	}
	return valid
}

function isAction(type: ActionType | TriggerType | undefined): boolean {
	return Object.entries(ActionType).some(([, value]) => value === type)
}

const getAllSteps = (flowVersion: FlowVersion): Step[] => {
	const steps: Step[] = [...flowVersion.triggers, ...flowVersion.actions]
	return steps
}

// function deleteAction(
//     flowVersion: FlowVersion,
//     request: DeleteActionRequest,
// ): FlowVersion {
//     return transferFlow(flowVersion, (parentStep) => {
//         if (parentStep.nextAction && parentStep.nextAction.name === request.name) {
//             const stepToUpdate: Action = parentStep.nextAction
//             parentStep.nextAction = stepToUpdate.nextAction
//         }
//         switch (parentStep.type) {
//             case ActionType.BRANCH: {
//                 if (
//                     parentStep.onFailureAction &&
//           parentStep.onFailureAction.name === request.name
//                 ) {
//                     const stepToUpdate: Action = parentStep.onFailureAction
//                     parentStep.onFailureAction = stepToUpdate.nextAction
//                 }
//                 if (
//                     parentStep.onSuccessAction &&
//           parentStep.onSuccessAction.name === request.name
//                 ) {
//                     const stepToUpdate: Action = parentStep.onSuccessAction
//                     parentStep.onSuccessAction = stepToUpdate.nextAction
//                 }
//                 break
//             }
//             case ActionType.LOOP_ON_ITEMS: {
//                 if (
//                     parentStep.firstLoopAction &&
//           parentStep.firstLoopAction.name === request.name
//                 ) {
//                     const stepToUpdate: Action = parentStep.firstLoopAction
//                     parentStep.firstLoopAction = stepToUpdate.nextAction
//                 }
//                 break
//             }
//             default:
//                 break
//         }
//         return parentStep
//     })
// }

// function getUsedPieces(trigger: Trigger): string[] {
//     return traverseInternal(trigger)
//         .filter(
//             (step) =>
//                 step.type === ActionType.Connector || step.type === TriggerType.Connector,
//         )
//         .map((step) => step.settings.pieceName)
//         .filter((value, index, self) => self.indexOf(value) === index)
// }

// const updateTrigger = (flowVersion: FlowVersion, updatedTriggerData: Trigger) => {
const updateTrigger = (flowVersion: FlowVersion, triggerData: Trigger) => {
	const flowVersionClone = clone(flowVersion)
	switch (triggerData.type) {
		case TriggerType.Connector:
			flowVersionClone.triggers = flowVersionClone.triggers.map((trigger) => {
				if (trigger.name !== triggerData.name) return trigger
				return triggerData
			})
	}
	return flowVersionClone
}

export const flowHelper = {
	isValid,
	// apply(
	//     flowVersion: FlowVersion,
	//     operation: FlowOperationRequest,
	// ): FlowVersion {
	//     let clonedVersion: FlowVersion = JSON.parse(JSON.stringify(flowVersion))
	//     switch (operation.type) {
	//         case FlowOperationType.MOVE_ACTION:
	//             clonedVersion = moveAction(clonedVersion, operation.request)
	//             break
	//         case FlowOperationType.LOCK_FLOW:
	//             clonedVersion.state = FlowVersionState.LOCKED
	//             break
	//         case FlowOperationType.CHANGE_NAME:
	//             clonedVersion.displayName = operation.request.displayName
	//             break
	//         case FlowOperationType.DELETE_ACTION:
	//             clonedVersion = deleteAction(clonedVersion, operation.request)
	//             break
	//         case FlowOperationType.ADD_ACTION: {
	//             clonedVersion = transferFlow(
	//                 addAction(clonedVersion, operation.request),
	//                 (step) => upgradePiece(step, operation.request.action.name),
	//             )
	//             break
	//         }
	//         case FlowOperationType.UPDATE_ACTION:
	//             clonedVersion = transferFlow(
	//                 updateAction(clonedVersion, operation.request),
	//                 (step) => upgradePiece(step, operation.request.name),
	//             )
	//             break
	//         case FlowOperationType.UPDATE_TRIGGER:
	//             clonedVersion.trigger = createTrigger(
	//                 clonedVersion.trigger.name,
	//                 operation.request,
	//                 clonedVersion.trigger.nextAction,
	//             )
	//             clonedVersion = transferFlow(clonedVersion, (step) =>
	//                 upgradePiece(step, operation.request.name),
	//             )
	//             break
	//         case FlowOperationType.DUPLICATE_ACTION: {
	//             clonedVersion = duplicateStep(operation.request.stepName, clonedVersion)
	//             break
	//         }
	//         default:
	//             break
	//     }
	//     clonedVersion.valid = isValid(clonedVersion)
	//     return clonedVersion
	// },
	getAllSteps,
	updateTrigger,
}
