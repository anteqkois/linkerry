import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import {
	Action,
	ActionConnector,
	ActionType,
	CustomError,
	DeepPartial,
	ErrorCode,
	FlowPopulated,
	RunActionResponse,
	assertNotNullOrUndefined,
	deepMerge,
	flowHelper,
	isAction,
	isConnectorAction,
	isTrigger,
} from '@linkerry/shared'
import { FlowVersionApi, StepApi } from '../../flows'
import { actionNodeFactory, nodeConfigs } from '../common/nodeFactory'
import { defaultEdgeFactory, generateEdgeId } from '../edges/edgesFactory'
import { ActionsSlice, CreateSlice } from './types'

export const createActionSlice: CreateSlice<ActionsSlice> = (set, get) => ({
	// ACTIONS
	editedAction: null,
	setEditedAction: (action: Action) => {
		const { setRightDrawer } = get()

		setRightDrawer('action_connector')
		set({
			editedAction: action,
			showRightDrawer: true,
		})
	},
	onClickSelectAction(nodeIdName: string) {
		get().setRightDrawer('select_action')
		const actionName = `action_${get().flow.version.stepsCount + 1}`
		set({
			showRightDrawer: true,
			editStepMetadata: {
				parentNodeName: nodeIdName,
				actionName,
			},
		})
	},
	async handleSelectActionConnector(connectorMetadata: ConnectorMetadataSummary) {
		const { getNodeById, editStepMetadata, setRightDrawer, patchNode, addNode, flow, setFlow, setEditedAction, addEdge } = get()

		assertNotNullOrUndefined(editStepMetadata?.actionName, 'editStepMetadata.actionName')
		const action: ActionConnector = {
			name: editStepMetadata.actionName,
			displayName: connectorMetadata.displayName,
			type: ActionType.CONNECTOR,
			valid: false,
			settings: {
				// errorHandlingOptions:{},
				packageType: connectorMetadata.packageType,
				connectorName: connectorMetadata.name,
				connectorVersion: connectorMetadata.version,
				connectorType: connectorMetadata.connectorType,
				actionName: '',
				input: {},
				inputUiInfo: {},
			},
			nextActionName: '',
		}

		const { data } = await FlowVersionApi.addAction(flow.version._id, {
			action,
			parentStepName: editStepMetadata?.parentNodeName,
		})

		const parentNode = getNodeById(editStepMetadata.parentNodeName)
		assertNotNullOrUndefined(parentNode, 'parentNode')

		// add action name to parent step
		if ('action' in parentNode.data)
			patchNode(parentNode.id, { data: { ...parentNode.data, action: { ...parentNode.data.action, nextActionName: editStepMetadata.actionName } } })
		else if ('trigger' in parentNode.data)
			patchNode(parentNode.id, {
				data: { ...parentNode.data, trigger: { ...parentNode.data.trigger, nextActionName: editStepMetadata.actionName } },
			})

		const newActionNode = actionNodeFactory({
			action,
			connectorMetadata,
			position: {
				x: parentNode.position.x,
				y: parentNode.position.y + nodeConfigs.BaseNode.height + nodeConfigs.gap.y,
			},
		})

		setRightDrawer('action_connector')
		addNode(newActionNode)
		addEdge(
			defaultEdgeFactory({
				sourceNodeId: editStepMetadata?.parentNodeName,
				targetNodeId: newActionNode.id,
			}),
		)
		setFlow({ ...flow, version: data })
		setEditedAction(action)
	},
	async patchEditedAction(update: DeepPartial<Action>) {
		// TODO handle errors -> back to previous form version ?
		const { editedAction, flow, setFlow, patchNode } = get()
		assertNotNullOrUndefined(editedAction, 'editedAction')

		const newAction = deepMerge<Action>(editedAction, update)
		if (JSON.stringify(newAction) === JSON.stringify(editedAction)) return console.log('Skip action update, data after merge is the same')

		const { data } = await FlowVersionApi.updateAction(flow.version._id, newAction)

		patchNode(newAction.name, { data: { action: newAction } })
		const newFlow: FlowPopulated = {
			...flow,
			version: data,
		}

		setFlow(newFlow)
		set({
			editedAction: newAction,
			flow: newFlow,
		})
	},
	async updateEditedAction(newAction: Action) {
		const { flow, setFlow, patchNode } = get()

		const { data: newFlowVersion } = await FlowVersionApi.updateAction(flow.version._id, newAction)
		assertNotNullOrUndefined(newFlowVersion, 'newFlowVersion')

		patchNode(newAction.name, { data: { action: newAction } })
		const newFlow: FlowPopulated = {
			...flow,
			version: newFlowVersion,
		}

		setFlow(newFlow)
		set({
			editedAction: newAction,
			flow: newFlow,
		})
	},
	deleteAction: async (actionName: string) => {
		const { flow, setFlow, deleteNode, setShowRightDrawer, patchNode, deleteEdge } = get()

		const { data: newFlowVersion } = await FlowVersionApi.deleteAction(flow.version._id, actionName)
		assertNotNullOrUndefined(newFlowVersion, 'newFlowVersion')

		const parentSteps = flowHelper.getParentSteps(flow.version, actionName)

		for (const step of parentSteps) {
			if (isTrigger(step))
				patchNode(step.name, {
					data: {
						trigger: {
							nextActionName: '',
						},
					},
				})
			else if (isAction(step))
				patchNode(step.name, {
					data: {
						action: {
							nextActionName: '',
						},
					},
				})

			deleteEdge(generateEdgeId(step.name, actionName))
		}

		setShowRightDrawer(false)
		deleteNode(actionName)
		setFlow({
			...flow,
			version: newFlowVersion,
		})
	},
	testAction: async () => {
		set({ testConnectorLoading: true })
		const { flow, setFlow, patchNode, editedAction } = get()
		if (!editedAction || !isConnectorAction(editedAction))
			throw new CustomError('Invalid action data', ErrorCode.INVALID_TYPE, {
				editedAction,
			})

		assertNotNullOrUndefined(editedAction, 'editedAction')
		let testResult: RunActionResponse | undefined = undefined

		try {
			testResult = (
				await StepApi.run({
					actionName: editedAction.name,
					flowVersionId: flow.version._id,
				})
			).data
			assertNotNullOrUndefined(testResult, 'testResult')

			if (testResult.success) {
				const action = flowHelper.getAction(testResult.flowVersion, editedAction.name)
				if (!action || !isConnectorAction(action))
					throw new CustomError(`Can not find action`, ErrorCode.ENTITY_NOT_FOUND, {
						action,
					})

				patchNode(action.name, {
					data: {
						action,
					},
				})
				set({ editedAction: action })
				setFlow({ ...flow, version: testResult.flowVersion })

				const { flowVersion, ...response } = testResult
				return response
			}
			return testResult
		} finally {
			set({ testConnectorLoading: false })
		}
	},
})
