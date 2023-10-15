'use client'

import { Id } from '@market-connector/shared'
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow'
import { create } from 'zustand'
import { CustomEdge, CustomEdgeId } from './edges/types'
import { CustomNode, CustomNodeId } from './nodes'

type EditorNode = Node | CustomNode

interface IEditorState {
  showDrawer: boolean
  setShowDrawer: (value: boolean) => void
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  connectorsMetadata: any
  flowId?: Id
  setFlowId: (id: Id) => void
  nodes: EditorNode[]
  setNodes: (nodes: CustomNode[]) => void
  addNode: (node: CustomNode) => void
  deleteNode: (nodeId: CustomNodeId) => void
  edges: Edge[]
  setEdges: (nodes: Edge[]) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  getNodeById: (id: string) => CustomNode | undefined
  updateNode: (nodeId: CustomNodeId, changes: Partial<CustomNode>) => void
  updateEdge: (id: CustomEdgeId, changes: Partial<CustomEdge>) => void
}

export const useEditor = create<IEditorState>((set, get) => ({
  isLoading: false,
  setIsLoading: (value: boolean) => set((state) => ({ isLoading: value })),
  showDrawer: false,
  setShowDrawer: (value: boolean) => set((state) => ({ showDrawer: value })),
  flowId: undefined,
  setFlowId: (id: Id) => set(() => ({ flowId: id })),
  nodes: [],
  setNodes: (nodes: CustomNode[]) => set((state) => ({ nodes })),
  addNode: (node: CustomNode) => set((state) => ({ nodes: [...state.nodes, node] })),
  // TODO add logic to rebuild edges
  deleteNode: (nodeId: CustomNodeId) => set((state) => ({ nodes: state.nodes.filter((node) => node.id !== nodeId) })),
  edges: [],
  setEdges: (edges: Edge[]) => set((state) => ({ edges })),
  addEdge: (edge: Edge) => set((state) => ({ edges: [...state.edges, edge] })),
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges<CustomNode['data']>(changes, get().nodes),
    })
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    })
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    })
  },
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
      }),
    })
    if (!updated) throw new Error(`Can not update node: ${id}, changes: ${changes}`)
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
    if (!updated) throw new Error(`Can not update egde: ${id}, changes: ${changes}`)
  },
}))
