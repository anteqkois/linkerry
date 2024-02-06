'use client'

import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import {
	Action,
	ActionConnector,
	ActionType,
	CustomError,
	DeepPartial,
	ErrorCode,
	Flow,
	FlowState,
	FlowStatus,
	FlowVersion,
	Id,
	Trigger,
	TriggerConnector,
	TriggerEmpty,
	TriggerEvent,
	TriggerType,
	WithoutId,
	assertNotNullOrUndefined,
	deepMerge,
	flowHelper,
	generateEmptyTrigger,
	isConnectorTrigger,
	isCustomHttpExceptionAxios,
	retriveStepNumber,
} from '@linkerry/shared'
import { Dispatch, SetStateAction } from 'react'
import {
	Connection,
	Edge,
	EdgeChange,
	NodeChange,
	OnConnect,
	OnEdgesChange,
	OnNodesChange,
	addEdge,
	applyEdgeChanges,
	applyNodeChanges,
} from 'reactflow'
import { create } from 'zustand'
import { EditorDrawer } from '../../shared/components/drawer/types'
import { FlowVersionApi } from '../flows/flows-version/api'
import { FlowApi } from '../flows/flows/api'
import { TriggerApi } from '../flows/triggers/api'
import { actionNodeFactory, nodeConfigs, selectTriggerNodeFactory, triggerNodeFactory } from './common/nodeFactory'
import { defaultEdgeFactory } from './edges/edgesFactory'
import { CustomEdge, CustomEdgeId } from './edges/types'
import { CustomNode, CustomNodeId } from './types'

// type EditorNode = Node | CustomNode
type EditorNode = CustomNode

const editorDrawers: EditorDrawer[] = [
	{
		name: 'select_trigger',
		title: 'Select Trigger',
	},
	{
		name: 'trigger_connector',
		title: 'Trigger',
	},
	{
		name: 'select_action',
		title: 'Select Action',
	},
	{
		name: 'action_connector',
		title: 'Action',
	},
]

const emptyFlow: Flow = {
	_id: '1234567890',
	status: FlowStatus.Unpublished,
	user: '1234567890',
	version: {
		_id: '123456789',
		user: '1234567890',
		displayName: 'Untitled',
		state: FlowState.Draft,
		flow: '1234567890',
		valid: false,
		stepsCount: 1,
		triggers: [],
		actions: [],
	},
}

interface IEditorState {
	drawer: EditorDrawer
	setDrawer: (name: EditorDrawer['name']) => void
	showDrawer: boolean
	setShowDrawer: Dispatch<SetStateAction<boolean>>
	isLoading: boolean
	setIsLoading: (value: boolean) => void
	// NODES
	nodes: EditorNode[]
	setNodes: (nodes: CustomNode[]) => void
	addNode: (node: CustomNode) => void
	deleteNode: (nodeId: CustomNodeId) => void
	onNodesChange: OnNodesChange
	getNodeById: (id: string) => CustomNode | undefined
	updateNode: (nodeId: CustomNodeId, changes: Partial<CustomNode>) => void
	// EDGES
	edges: Edge[]
	setEdges: (nodes: Edge[]) => void
	addEdge: (edge: Edge) => void
	onEdgesChange: OnEdgesChange
	onConnect: OnConnect
	updateEdge: (id: CustomEdgeId, changes: Partial<CustomEdge>) => void
	// FLOW
	flow: Flow
	loadFlow: (id: Id) => Promise<Flow | null>
	setFlow: (flow: Flow) => void
	// CONNECTORS
	testConnectorLoading: boolean
	// TRIGGERS
	editedTrigger: Trigger | null
	setEditedTrigger: (trigger: Trigger) => void
	onClickSelectTrigger: (trigger: Trigger) => void
	handleSelectTriggerConnector: (connectorMetadata: ConnectorMetadataSummary) => Promise<void>
	updateEditedTrigger: (newTrigger: Trigger) => Promise<void>
	patchEditedTriggerConnector: (update: DeepPartial<WithoutId<TriggerConnector>>) => Promise<void>
	resetTrigger: (triggerName: string) => Promise<void>
	testPoolTrigger: (triggerName: string) => Promise<TriggerEvent[]>
	// ACTIONS
	editedAction: Action | null
	setEditedAction: (action: Action) => void
	onClickSelectAction: (nodeId: string) => void
	handleSelectActionConnector: (connectorMetadata: ConnectorMetadataSummary) => Promise<void>
	patchEditedAction: (update: DeepPartial<Action>) => Promise<void>
	updateEditedAction: (newAction: Action) => Promise<void>
	deleteAction: (actionName: string) => Promise<void>
	// resetAction: (actionName: string) => Promise<void>
	// STEPS
	editStepMetadata: {
		parentNodeName: string
		actionName: string
	} | null
	setEditStepMetadata: (data: IEditorState['editStepMetadata']) => void
}

export const useEditor = create<IEditorState>((set, get) => ({
	isLoading: false,
	setIsLoading: (value: boolean) => set((state) => ({ isLoading: value })),
	showDrawer: false,
	setShowDrawer: (value: SetStateAction<boolean>) => {
		if (typeof value === 'function') set((state) => ({ showDrawer: value(state.showDrawer) }))
		else set((state) => ({ showDrawer: value }))
	},
	drawer: editorDrawers[0],
	setDrawer: (name: EditorDrawer['name']) => {
		const newDrawer = editorDrawers.find((drawer) => drawer.name === name)
		if (newDrawer?.name === get().drawer.name) return
		set(() => ({ drawer: newDrawer }))
	},
	// NODES
	nodes: [],
	setNodes: (nodes: CustomNode[]) => set((state) => ({ nodes })),
	addNode: (node: CustomNode) => set((state) => ({ nodes: [...state.nodes, node] })),
	// TODO add logic to rebuild edges
	deleteNode: (nodeId: CustomNodeId) => set((state) => ({ nodes: state.nodes.filter((node) => node.id !== nodeId) })),
	getNodeById: (id: string) => {
		// TODO change it in fitire to map to not using filter (performance)?
		return get().nodes.filter((node) => node.id === id)[0] as CustomNode
	},
	updateNode: (id: CustomNodeId, changes: Partial<CustomNode>) => {
		let updated = false
		set({
			nodes: get().nodes.map((node) => {
				if (node.id !== id) return node
				updated = true
				return deepMerge(node, changes)
			}) as CustomNode[],
		})
		if (!updated) throw new CustomError(`Can not update node`)
	},
	// EDGES
	edges: [],
	setEdges: (edges: Edge[]) => set((state) => ({ edges })),
	addEdge: (edge: Edge) => set((state) => ({ edges: [...state.edges, edge] })),
	onNodesChange: (changes: NodeChange[]) => {
		set({
			nodes: applyNodeChanges<CustomNode['data']>(changes, get().nodes) as CustomNode[],
		})
	},
	onEdgesChange: (changes: EdgeChange[]) => {
		set({
			edges: applyEdgeChanges(changes, get().edges),
		})
	},
	updateEdge: (id: CustomEdgeId, changes: Partial<CustomEdge>) => {
		let updated = false
		set({
			edges: get().edges.map((edge) => {
				if (edge.id !== id) return edge
				updated = true
				return { ...edge, ...changes, data: { ...edge.data, ...edge.data } }
			}),
		})
		if (!updated) throw new CustomError(`Can not update egde`)
	},
	onConnect: (connection: Connection) => {
		set({
			edges: addEdge(connection, get().edges),
		})
	},
	// FLOW
	flow: emptyFlow,
	loadFlow: async (id: Id) => {
		let flow: string | Flow | null = localStorage.getItem('flow')
		if (flow) {
			flow = JSON.parse(flow) as Flow
		} else {
			const { data } = await FlowApi.get(id)
			flow = data
			localStorage.setItem('flow', JSON.stringify(flow))
		}

		if (!flow) throw new CustomError('Can not retrive flow')

		set({ flow })
		return flow
	},
	setFlow: (flow: Flow) => {
		set({ flow })
		localStorage.setItem('flow', JSON.stringify(flow))
	},
	// CONNECTORS
	testConnectorLoading: false,
	// TRIGGERS
	editedTrigger: null,
	setEditedTrigger: (trigger: Trigger) => {
		const { setDrawer, showDrawer } = get()

		setDrawer('trigger_connector')
		set({
			editedTrigger: trigger,
			showDrawer: !showDrawer,
		})
	},
	onClickSelectTrigger(trigger: Trigger) {
		const { setDrawer, showDrawer } = get()

		setDrawer('select_trigger')
		set({
			editedTrigger: trigger,
			showDrawer: !showDrawer,
		})
	},
	handleSelectTriggerConnector: async (connectorMetadata: ConnectorMetadataSummary) => {
		const { editedTrigger, updateEditedTrigger, updateNode, setDrawer } = get()
		assertNotNullOrUndefined(editedTrigger, 'editedTrigger')

		const newTrigger: TriggerConnector = {
			name: editedTrigger.name,
			displayName: connectorMetadata.displayName,
			type: TriggerType.CONNECTOR,
			valid: false,
			settings: {
				connectorName: connectorMetadata.name,
				connectorVersion: connectorMetadata.version,
				connectorType: connectorMetadata.connectorType,
				triggerName: '',
				input: {},
				inputUiInfo: {},
			},
			nextActionName: '',
		}

		await updateEditedTrigger(newTrigger)
		updateNode(editedTrigger.name, triggerNodeFactory({ trigger: newTrigger, connectorMetadata }))
		setDrawer('trigger_connector')
	},
	updateEditedTrigger: async (newTrigger: Trigger) => {
		const { flow, setFlow } = get()

		const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)
		if (!data) throw new CustomError(`Can not update flow trigger. Missing flow-version in response`)

		const newFlow: Flow = {
			...flow,
			version: data,
		}

		setFlow(newFlow)
		set({
			editedTrigger: newTrigger,
			flow: newFlow,
		})
	},
	patchEditedTriggerConnector: async (update: DeepPartial<TriggerConnector>) => {
		const { editedTrigger, flow, setFlow } = get()
		if (!editedTrigger) throw new CustomError('editedTrigger can not be empty during update')

		const newTrigger = deepMerge(editedTrigger, update)
		const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)
		if (!data) throw new CustomError(`Can not update flow trigger. No flowVersion in response`)

		const newFlow: Flow = {
			...flow,
			version: data,
		}

		setFlow(newFlow)
		set({
			editedTrigger: newTrigger,
			flow: newFlow,
		})
	},
	resetTrigger: async (triggerName: string) => {
		let emptyTrigger: TriggerEmpty | undefined = undefined
		// eslint-disable-next-line prefer-const
		let { nodes, flow, setFlow } = get()
		if (!flow) throw new CustomError('Can not retrive flow')

		const stepNumber = retriveStepNumber(triggerName)
		nodes = nodes.map((node: CustomNode) => {
			if (node.id !== triggerName) return node as CustomNode

			emptyTrigger = generateEmptyTrigger(`trigger_${stepNumber}`)
			const emptyNode = selectTriggerNodeFactory({ trigger: emptyTrigger })

			return emptyNode
		})
		if (!emptyTrigger) throw new CustomError(`Can not generate empty trigger`)

		flow.version.triggers = flow.version.triggers.map((trigger) => {
			if (trigger.name !== triggerName) return trigger
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return emptyTrigger!
		})
		await FlowVersionApi.updateTrigger(flow.version._id, emptyTrigger)

		setFlow(flow)
		set({
			nodes,
			showDrawer: true,
			drawer: editorDrawers.find((entry) => entry.name === 'select_trigger'),
			editedTrigger: emptyTrigger,
		})
	},
	testPoolTrigger: async (triggerName: string) => {
		set({ testConnectorLoading: true })
		const { flow, setFlow, updateNode } = get()
		let newFlowVersion: FlowVersion | undefined = undefined
		let testResult: TriggerEvent[] = []

		try {
			testResult = (
				await TriggerApi.poolTest({
					flowId: flow._id,
					triggerName,
				})
			).data

			const trigger = flowHelper.getTrigger(flow.version, triggerName)
			if (!trigger || !isConnectorTrigger(trigger))
				throw new CustomError({
					code: ErrorCode.CONNECTOR_TRIGGER_NOT_FOUND,
					params: {
						message: `Can not find trigger`,
					},
				})

			trigger.settings.inputUiInfo = {
				currentSelectedData: testResult[0],
				lastTestDate: testResult[0].createdAt,
			}
			trigger.valid = true

			updateNode(trigger.name, {
				data: {
					trigger,
				},
			})
			newFlowVersion = flowHelper.updateTrigger(flow.version, trigger)
			setFlow({ ...flow, version: newFlowVersion })
		} catch (error) {
			if (isCustomHttpExceptionAxios(error)) {
				console.log(error.response.data)
			} else console.log(error)
		}

		set({ testConnectorLoading: false })
		return testResult
	},
	// ACTIONS
	editedAction: null,
	setEditedAction: (action: Action) =>
		set({
			editedAction: action,
		}),
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
		if (!data) throw new CustomError(`Can not update flow trigger. No flowVersion in response`)

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
	// STEPS
	setEditStepMetadata: (data: IEditorState['editStepMetadata']) => {
		set({
			editStepMetadata: data,
		})
	},
	editStepMetadata: null,
}))
