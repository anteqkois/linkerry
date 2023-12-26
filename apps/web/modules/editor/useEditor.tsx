'use client'

import { Action, Id, Trigger } from '@market-connector/shared'
import { Dispatch, SetStateAction } from 'react'
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
import { EditorDrawer } from '../connectors-metadata/types'
import { CustomEdge, CustomEdgeId } from './edges/types'
import { CustomNode, CustomNodeId } from './nodes'

type EditorNode = Node | CustomNode

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

interface IEditorState {
  drawer: EditorDrawer
  setDrawer: (name: EditorDrawer['name']) => void
  showDrawer: boolean
  setShowDrawer: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  // connectorsMetadata: any
  flowId?: Id
  setFlowId: (id: Id) => void
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
  // TRIGGERS
  editedTrigger: Trigger | null
  setEditedTrigger: (trigger: Trigger) => void
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
  flowId: undefined,
  setFlowId: (id: Id) => set(() => ({ flowId: id })),
  drawer: editorDrawers[0],
  setDrawer: (name: EditorDrawer['name']) => {
    const newDrawer = editorDrawers.find((drawer) => (drawer.name = name))
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
      }),
    })
    if (!updated) throw new Error(`Can not update node: ${id}, changes: ${changes}`)
  },
  // EDGES
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
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    })
  },
  // TRIGGERS
  editedTrigger: null,
  setEditedTrigger: (trigger: Trigger) =>
    set({
      editedTrigger: trigger,
    }),
  // ACTIONS
  editedAction: null,
  setEditedAction: (action: Action) =>
    set({
      editedAction: action,
    }),
}))
