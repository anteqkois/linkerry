import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { Action, ActionConnector, ActionType, DeepPartial, Flow, assertNotNullOrUndefined, deepMerge } from '@linkerry/shared'
import { FlowVersionApi } from '../../flows'
import { actionNodeFactory, nodeConfigs } from '../common/nodeFactory'
import { defaultEdgeFactory } from '../edges/edgesFactory'
import { ActionsSlice, CreateSlice } from './types'

export const createActionSlice: CreateSlice<ActionsSlice> = (set, get) => ({
	// ACTIONS
	editedAction: null,
	setEditedAction: (action: Action) => {
		const { setDrawer, showDrawer } = get()

		setDrawer('action_connector')
		set({
			editedAction: action,
			showDrawer: !showDrawer,
		})
	},
	onClickSelectAction(nodeIdName: string) {
		get().setDrawer('select_action')
		const actionName = `action_${get().flow.version.stepsCount}`
		set({
			showDrawer: true,
			editStepMetadata: {
				parentNodeName: nodeIdName,
				actionName,
			},
		})
	},
	async handleSelectActionConnector(connectorMetadata: ConnectorMetadataSummary) {
		const { getNodeById, editStepMetadata, setDrawer, updateNode, addNode, flow, setFlow, setEditedAction, addEdge } = get()

		assertNotNullOrUndefined(editStepMetadata?.actionName, 'editStepMetadata.actionName')
		const action: ActionConnector = {
			name: editStepMetadata.actionName,
			displayName: connectorMetadata.displayName,
			type: ActionType.CONNECTOR,
			valid: false,
			settings: {
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
			updateNode(parentNode.id, { data: { ...parentNode.data, action: { ...parentNode.data.action, nextActionName: editStepMetadata.actionName } } })
		else
			updateNode(parentNode.id, {
				data: { ...parentNode.data, trigger: { ...parentNode.data.trigger, nextActionName: editStepMetadata.actionName } },
			})

		const newActionNode = actionNodeFactory({
			action,
			connectorMetadata,
			position: {
				x: parentNode.position.x,
				y: parentNode.position.y + nodeConfigs.TriggerNode.height + nodeConfigs.gap.y,
			},
		})

		setDrawer('action_connector')
		addNode(newActionNode)
		addEdge(
			defaultEdgeFactory({
				sourceNodeId: editStepMetadata?.parentNodeName,
				targetNodeId: newActionNode.id,
			}),
		)
		setFlow({ ...flow, version: data })
		setEditedAction(action)
		console.log(1)
	},
	async patchEditedAction(update: DeepPartial<Action>) {
		const { editedAction, flow, setFlow } = get()
		assertNotNullOrUndefined(editedAction, 'editedAction')

		const newAction = deepMerge<Action>(editedAction, update)
		const { data } = await FlowVersionApi.updateAction(flow.version._id, newAction)

		const newFlow: Flow = {
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
		const { flow, setFlow } = get()

		const { data: newFlowVersion } = await FlowVersionApi.updateAction(flow.version._id, newAction)
		assertNotNullOrUndefined(newFlowVersion, 'newFlowVersion')

		const newFlow: Flow = {
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
		const { flow, setFlow, deleteNode, setShowDrawer } = get()

		const { data: newFlowVersion } = await FlowVersionApi.deleteAction(flow.version._id, actionName)
		assertNotNullOrUndefined(newFlowVersion, 'newFlowVersion')

		setShowDrawer(false)
		deleteNode(actionName)
		setFlow({
			...flow,
			version: newFlowVersion,
		})
	},
})
