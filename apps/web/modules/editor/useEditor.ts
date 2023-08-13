'use client'

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
import { CustomNode, CustomNodeId, CustomNodeType } from './nodes'

type EditorNode = Node | CustomNode

interface IEditorState {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  lastId: Record<CustomNodeType, number>
  // nodes: (CustomNode | Node)[]
  nodes: EditorNode[]
  setNodes: (nodes: CustomNode[]) => void
  addNode: (node: CustomNode) => void
  edges: Edge[]
  setEdges: (nodes: Edge[]) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  getNodeById: (id: string) => CustomNode | undefined
  updateNode: (nodeId: CustomNodeId, changes: Partial<CustomNode>) => void
  // handleAddNode: (node: IStrategyNode| IStrategyBuyNode ) => void
}

export const useEditor = create<IEditorState>((set, get) => ({
  isLoading: false,
  setIsLoading: (value: boolean) => set((state) => ({ isLoading: value })),
  lastId: {
    AddStrategyBuyNode: 0,
    StrategyBuyNode: 0,
    StrategyNode: 0,
  },
  nodes: [],
  setNodes: (nodes: CustomNode[]) => set((state) => ({ nodes })),
  addNode: (node: CustomNode) => set((state) => ({ nodes: [...state.nodes, node] })),
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
    set({
      nodes: get().nodes.map((node) => {
        if (node.id !== id) return node
        return { ...node, changes }
      }),
    })
  },
}))
