'use client'

import {
	Action,
	CustomError,
	DeepPartial,
	Flow,
	FlowState,
	FlowStatus,
	Id,
	Trigger,
	TriggerConnector,
	TriggerEmpty,
	WithoutId,
	deepMerge,
	generateEmptyTrigger,
} from '@market-connector/shared'
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
import { FlowVersionApi } from '../flows-version/api'
import { FlowApi } from '../flows/api'
import { CustomEdge, CustomEdgeId } from './edges/types'
import { CustomNode, CustomNodeId } from './nodes'
import { selectTriggerNodeFactory } from './nodes/components/nodeFactory'

// type EditorNode = Node | CustomNode
type EditorNode = CustomNode

const editorDrawers: EditorDrawer[] = [
	{
		name: 'select_trigger',
		title: 'Select Trigger',
	},
	{
		name: 'trigger',
		title: 'Trigger',
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
	onEdgesChange: OnEdgesChange
	onConnect: OnConnect
	updateEdge: (id: CustomEdgeId, changes: Partial<CustomEdge>) => void
	// FLOW
	flow: Flow
	loadFlow: (id: Id) => Promise<Flow | null>
	setFlow: (flow: Flow) => void
	updateFlow: (id: Id, flow: Partial<Flow>) => Promise<void>
	// TRIGGERS
	editedTrigger: Trigger | null
	setEditedTrigger: (trigger: Trigger) => void
	patchEditedTrigger: (update: Partial<Trigger>) => Promise<void>
	updateEditedTrigger: (newTrigger: Trigger) => Promise<void>
	patchEditedTriggerConnector: (update: DeepPartial<WithoutId<TriggerConnector>>) => Promise<void>
	resetTrigger: (triggerName: string) => Promise<void>
	// ACTIONS
	editedAction: Action | null
	setEditedAction: (action: Action) => void
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
				return { ...node, ...changes, data: { ...node.data, ...changes.data } }
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
	updateFlow: async (id: Id, flow: Partial<Flow>) => {
		const { data } = await FlowApi.patch(id, flow)
		set({ flow: data })
	},
	// TRIGGERS
	editedTrigger: null,
	setEditedTrigger: (trigger: Trigger) =>
		set({
			editedTrigger: trigger,
		}),
	patchEditedTrigger: async (update: Partial<Trigger>) => {
		const { editedTrigger, flow } = get()
		if (!editedTrigger) throw new CustomError('editedTrigger can not be empty during update')

		const newTrigger = deepMerge(editedTrigger, update)
		const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)
		if (!data) throw new CustomError(`Can not update flow trigger. No flowVersion in response`)

		const newFlow: Flow = {
			...flow,
			version: data,
		}

		set({
			editedTrigger: newTrigger,
			flow: newFlow,
		})
		localStorage.setItem('flow', JSON.stringify(newFlow))
	},
	updateEditedTrigger: async (newTrigger: Trigger) => {
		const { flow } = get()

		const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)
		if (!data) throw new CustomError(`Can not update flow trigger. Missing flow-version in response`)

		const newFlow: Flow = {
			...flow,
			version: data,
		}

		set({
			editedTrigger: newTrigger,
			flow: newFlow,
		})
		localStorage.setItem('flow', JSON.stringify(newFlow))
	},
	patchEditedTriggerConnector: async (update: DeepPartial<TriggerConnector>) => {
		const { editedTrigger, flow } = get()
		if (!editedTrigger) throw new CustomError('editedTrigger can not be empty during update')

		const newTrigger = deepMerge(editedTrigger, update)
		const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)
		if (!data) throw new CustomError(`Can not update flow trigger. No flowVersion in response`)

		const newFlow: Flow = {
			...flow,
			version: data,
		}

		set({
			editedTrigger: newTrigger,
			flow: newFlow,
		})
		localStorage.setItem('flow', JSON.stringify(newFlow))
	},
	resetTrigger: async (triggerName: string) => {
		let emptyTrigger: TriggerEmpty | undefined = undefined

		// eslint-disable-next-line prefer-const
		let { nodes, flow } = get()
		if (!flow) throw new CustomError('Can not retrive flow')

		nodes = nodes.map((node: CustomNode) => {
			if (node.id !== triggerName) return node as CustomNode

			emptyTrigger = generateEmptyTrigger(`trigger_${flow.version.stepsCount + 1}`)
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

		set({
			nodes,
			flow,
			showDrawer: true,
			drawer: editorDrawers.find((entry) => entry.name === 'select_trigger'),
			editedTrigger: emptyTrigger,
		})
	},
	// ACTIONS
	editedAction: null,
	setEditedAction: (action: Action) =>
		set({
			editedAction: action,
		}),
}))
