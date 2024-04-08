import { CustomError, ErrorCode, assertNotNullOrUndefined, clone, deepMerge } from '../../../common'
import { Action, ActionType } from '../actions/action'
import { FlowVersion } from '../flow-versions'
import { ActionSchemaGraph, StepNotEmpty, TriggerSchemaGraph } from '../steps/step'
import { Trigger, TriggerNotEmpty, TriggerType } from '../triggers/trigger'
import {
	AddActionRequest,
	DeleteActionRequest,
	FlowOperationRequest,
	FlowOperationType,
	UpdateActionRequest,
	UpdateTriggerRequest,
} from './flow-operation'

type Step = Action | Trigger

function isValid(flowVersion: FlowVersion) {
	const steps = flowHelper.getAllSteps(flowVersion)
	return steps.every((step) => step.valid)
}

function isAction(type: ActionType | TriggerType | undefined): boolean {
	return Object.entries(ActionType).some(([, value]) => value === type)
}

const getAllSteps = (flowVersion: FlowVersion): Step[] => {
	const steps: Step[] = [...flowVersion.triggers, ...flowVersion.actions]
	return steps
}

const getAllPrependSteps = (flowVersion: FlowVersion, stepName: string): Step[] => {
	for (const trigger of flowVersion.triggers) {
		const steps: Step[] = []
		steps.push(trigger)
		if (trigger.name === stepName) return steps
		if (!trigger.nextActionName) continue

		let action = flowHelper.getAction(flowVersion, trigger.nextActionName)
		while (action) {
			if (action.name === stepName) return steps
			steps.push(action)
			action = flowHelper.getAction(flowVersion, action.nextActionName)
		}
	}
	return []
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

const updateTrigger = (flowVersion: FlowVersion, triggerData: UpdateTriggerRequest) => {
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

const updateAction = (flowVersion: FlowVersion, actionData: UpdateActionRequest) => {
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

const getParentSteps = (flowVersion: FlowVersion, nextActionName: string) => {
	return [
		flowVersion.triggers.filter((step) => step.nextActionName === nextActionName),
		flowVersion.actions.filter((step) => step.nextActionName === nextActionName),
	].flat()
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

const addAction = (flowVersion: FlowVersion, { action, parentStepName }: AddActionRequest) => {
	flowVersion = addNextActionName(flowVersion, parentStepName, action.name)
	flowVersion.actions.push(action)
	flowVersion.stepsCount += 1
	return flowVersion
}

const deleteAction = (flowVersion: FlowVersion, { name }: DeleteActionRequest) => {
	flowVersion = removeNextActionName(flowVersion, name)
	flowVersion.actions = flowVersion.actions.filter((action) => action.name !== name)
	flowVersion.stepsCount -= 1
	return flowVersion
}

const buildFlowVersionTriggersGraph = (flowVersion: FlowVersion) => {
	const triggersGraph: TriggerSchemaGraph[] = []

	function buildStep(step: Action): ActionSchemaGraph | null {
		const actionSchemaGraph: ActionSchemaGraph = { ...step, nextAction: null }
		if (!actionSchemaGraph.nextActionName) return actionSchemaGraph

		// Find the next action and build it
		const nextAction = flowVersion.actions.find((action) => action.name === actionSchemaGraph.nextActionName) as ActionSchemaGraph
		if (!nextAction) return null
		actionSchemaGraph.nextAction = buildStep(nextAction)

		return actionSchemaGraph
	}

	// Build the triggers
	for (const trigger of flowVersion.triggers as TriggerNotEmpty[]) {
		const action = flowVersion.actions.find((action) => action.name === trigger.nextActionName)
		triggersGraph.push({ ...trigger, nextAction: action ? buildStep(action) : null })
	}

	return triggersGraph
}

// const getRelationConnectorNamesFromTriggersGraph = (triggerSchemaGraph: TriggerSchemaGraph) => {
// 	const connectorNames: string[] = []
// 	const getName = (actionSchemaGraph: ActionSchemaGraph) => {
// 		console.log('actionSchemaGraph', actionSchemaGraph)
// 		if (actionSchemaGraph.nextAction) getName(actionSchemaGraph.nextAction)
// 		connectorNames.push(actionSchemaGraph.settings.connectorName)
// 	}

// 	if (triggerSchemaGraph.nextAction) getName(triggerSchemaGraph.nextAction)
// 	connectorNames.push(triggerSchemaGraph.settings.connectorName)
// 	return connectorNames.reverse()
// }
const transformFlowVersionToChainMap = (flowVersion: FlowVersion) => {
	const triggersMap: StepNotEmpty[][] = []

	let triggerIndex = 0
	let triggerMap: StepNotEmpty[] = []
	const loadAction = (action: StepNotEmpty) => {
		if (action.nextActionName) {
			const nextAction = flowVersion.actions.find((a) => a.name === action.nextActionName)
			if (nextAction) loadAction(nextAction)
		}
		triggerMap.push(action)
	}

	for (const trigger of flowVersion.triggers) {
		if (trigger.nextActionName) {
			const action = flowVersion.actions.find((action) => action.name === trigger.nextActionName)
			if (action) loadAction(action)
		}
		triggerMap.push(trigger as TriggerNotEmpty)

		triggersMap[triggerIndex] = triggerMap.reverse()
		triggerMap = []
		triggerIndex++
	}

	return triggersMap
}

export const flowHelper = {
	isValid,
	apply(flowVersion: FlowVersion, operation: FlowOperationRequest): FlowVersion {
		let clonedVersion: FlowVersion = JSON.parse(JSON.stringify(flowVersion))
		switch (operation.type) {
			// case FlowOperationType.MOVE_ACTION:
			// 	clonedVersion = moveAction(clonedVersion, operation.request)
			// 	break
			// case FlowOperationType.LOCK_FLOW:
			// 	clonedVersion.state = FlowVersionState.LOCKED
			// 	break
			case FlowOperationType.CHANGE_NAME:
				clonedVersion.displayName = operation.request.displayName
				break
			case FlowOperationType.DELETE_ACTION:
				clonedVersion = deleteAction(clonedVersion, operation.request)
				break
			case FlowOperationType.ADD_ACTION: {
				clonedVersion = addAction(clonedVersion, operation.request)
				break
			}
			case FlowOperationType.UPDATE_ACTION:
				clonedVersion = updateAction(clonedVersion, operation.request)
				break
			case FlowOperationType.UPDATE_TRIGGER:
				clonedVersion = updateTrigger(clonedVersion, operation.request)
				break
			// case FlowOperationType.DUPLICATE_ACTION: {
			// 	clonedVersion = duplicateStep(operation.request.stepName, clonedVersion)
			// 	break
			// }
			default:
				break
		}
		clonedVersion.valid = isValid(clonedVersion)
		return clonedVersion
	},

	getStep,
	getAllPrependSteps,
	getAllSteps,
	// updateTrigger,
	// patchTrigger,
	getTrigger,
	// addAction,
	getAction,
	// updateAction,
	getParentSteps,
	buildFlowVersionTriggersGraph,
	transformFlowVersionToChainMap,
}
