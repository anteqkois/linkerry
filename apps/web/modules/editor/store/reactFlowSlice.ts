import { DeepPartial, assertNotNullOrUndefined, deepMerge } from '@linkerry/shared'
import { Connection, Edge, EdgeChange, NodeChange, addEdge, applyEdgeChanges, applyNodeChanges } from 'reactflow'
import { CustomEdge, CustomEdgeId } from '../edges/types'
import { CustomNode, CustomNodeId } from '../types'
import { CreateSlice, ReactFlowSlice } from './types'

export const createReactFlowSlice: CreateSlice<ReactFlowSlice> = (set, get) => ({
	nodes: [],
	setNodes: (nodes: CustomNode[]) => set((state) => ({ nodes })),
	addNode: (node: CustomNode) => set((state) => ({ nodes: [...state.nodes, node] })),
	// TODO add logic to rebuild edges
	deleteNode: (nodeId: CustomNodeId) => set((state) => ({ nodes: state.nodes.filter((node) => node.id !== nodeId) })),
	getNodeById: (id: string) => {
		// TODO change it in fitire to map to not using filter (performance)?
		return get().nodes.filter((node) => node.id === id)[0] as CustomNode
	},
	updateNode: (id: CustomNodeId, changes: DeepPartial<CustomNode>) => {
		let updated
		set({
			nodes: get().nodes.map((node) => {
				if (node.id !== id) return node
				updated = true
				return deepMerge(node, changes)
			}) as CustomNode[],
		})
		assertNotNullOrUndefined(updated, 'node', { id })
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
		assertNotNullOrUndefined(updated, 'edge', { id })
	},
	onConnect: (connection: Connection) => {
		set({
			edges: addEdge(connection, get().edges),
		})
	},
})
