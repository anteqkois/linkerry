import { CustomError, ErrorCode, assertNotNullOrUndefined, clone, deepMerge } from '../../../common'
import { Action, ActionType } from '../actions/action'
import { Trigger, TriggerType } from '../triggers/trigger'
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

function getStep(flowVersion: FlowVersion, stepName: string): Action | Trigger | undefined {
	return getAllSteps(flowVersion).find((step) => step.name === stepName)
}

function getTrigger(flowVersion: FlowVersion, triggerName: string): Trigger | undefined {
	return flowVersion.triggers.find((trigger) => trigger.name === triggerName)
}

function getAction(flowVersion: FlowVersion, actionName: string): Action | undefined {
	return flowVersion.actions.find((trigger) => trigger.name === actionName)
}

const updateTrigger = (flowVersion: FlowVersion, triggerData: Trigger) => {
	const flowVersionClone = clone(flowVersion)
	switch (triggerData.type) {
		case TriggerType.CONNECTOR:
		case TriggerType.EMPTY:
			flowVersionClone.triggers = flowVersionClone.triggers.map((trigger) => {
				if (trigger.name !== triggerData.name) return trigger
				return triggerData
			})
	}
	return flowVersionClone
}

const patchTrigger = (flowVersion: FlowVersion, triggerName: string, updateTriggerData: Partial<Trigger>) => {
	const flowVersionClone = clone(flowVersion)

	const sourceTrigger = flowHelper.getTrigger(flowVersion, triggerName)
	assertNotNullOrUndefined(sourceTrigger, 'sourceTrigger')

	switch (sourceTrigger.type) {
		case TriggerType.CONNECTOR:
		case TriggerType.EMPTY:
			flowVersionClone.triggers = flowVersionClone.triggers.map((trigger) => {
				if (trigger.name !== triggerName) return trigger
				const newTrigger = deepMerge<Trigger>(trigger, updateTriggerData)
				return newTrigger
			})
	}
	return flowVersionClone
}

const updateAction = (flowVersion: FlowVersion, actionData: Action) => {
	const flowVersionClone = clone(flowVersion)
	switch (actionData.type) {
		case ActionType.CONNECTOR:
			flowVersionClone.actions = flowVersionClone.actions.map((action) => {
				if (action.name !== actionData.name) return action
				return actionData
			})
			break
		case ActionType.BRANCH:
			// case ActionType.LOOP_ON_ITEMS:
			// case ActionType.MERGE_BRANCH:
			throw new CustomError('Unsuported action type', ErrorCode.INVALID_TYPE, {
				actionData,
			})
	}
	return flowVersionClone
}

const addNextActionName = (flowVersion: FlowVersion, stepName: string, nextActionName: string) => {
	let done = false

	flowVersion.triggers = flowVersion.triggers.map((trigger) => {
		if (trigger.name === stepName) {
			done = true
			return { ...trigger, nextActionName }
		}
		return trigger
	})
	if (done) return flowVersion
	flowVersion.actions = flowVersion.actions.map((action) => {
		if (action.name === stepName) {
			done = true
			return { ...action, nextActionName }
		}
		return action
	})
	if (!done)
		throw new CustomError('Can not find step to edit nextActionName', ErrorCode.STEP_NOT_FOUND, {
			stepName,
		})
	return flowVersion
}

const removeNextActionName = (flowVersion: FlowVersion, nextActionName: string) => {
	flowVersion.triggers = flowVersion.triggers.map((trigger) => {
		if (trigger.nextActionName === nextActionName) {
			return { ...trigger, nextActionName: '' }
		}
		return trigger
	})
	flowVersion.actions = flowVersion.actions.map((action) => {
		switch (action.type) {
			case ActionType.CONNECTOR:
				if (action.nextActionName === nextActionName) {
					return { ...action, nextActionName: '' }
				}
				return action
			// check failure next action etc.
			case ActionType.BRANCH:
				// case ActionType.LOOP_ON_ITEMS:
				// case ActionType.MERGE_BRANCH:
				throw new CustomError('Unsupported operation during removeNextActionName', ErrorCode.INVALID_TYPE, {
					action,
				})
		}
	})
	return flowVersion
}

const addAction = (flowVersion: FlowVersion, parentStepName: string, action: Action) => {
	flowVersion = addNextActionName(flowVersion, parentStepName, action.name)
	flowVersion.actions.push(action)
	return flowVersion
}

const deleteAction = (flowVersion: FlowVersion, actionName: string) => {
	flowVersion = removeNextActionName(flowVersion, actionName)
	flowVersion.actions = flowVersion.actions.filter((action) => action.name !== actionName)
	return flowVersion
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

// function getUsedConnectors(trigger: Trigger): string[] {
//     return traverseInternal(trigger)
//         .filter(
//             (step) =>
//                 step.type === ActionType.Connector || step.type === TriggerType.Connector,
//         )
//         .map((step) => step.settings.connectorName)
//         .filter((value, index, self) => self.indexOf(value) === index)
// }

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
	//                 (step) => upgradeConnector(step, operation.request.action.name),
	//             )
	//             break
	//         }
	//         case FlowOperationType.UPDATE_ACTION:
	//             clonedVersion = transferFlow(
	//                 updateAction(clonedVersion, operation.request),
	//                 (step) => upgradeConnector(step, operation.request.name),
	//             )
	//             break
	//         case FlowOperationType.UPDATE_TRIGGER:
	//             clonedVersion.trigger = createTrigger(
	//                 clonedVersion.trigger.name,
	//                 operation.request,
	//                 clonedVersion.trigger.nextAction,
	//             )
	//             clonedVersion = transferFlow(clonedVersion, (step) =>
	//                 upgradeConnector(step, operation.request.name),
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
	getStep,
	getAllSteps,
	updateTrigger,
	patchTrigger,
	getTrigger,
	addAction,
	getAction,
	updateAction,
	deleteAction,
}
