'use client'

import { Action, Flow, Id, Trigger, TriggerEmpty, WithoutId, deepMerge, generateEmptyTrigger } from '@market-connector/shared'
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

interface IEditorState {
  drawer: EditorDrawer
  setDrawer: (name: EditorDrawer['name']) => void
  showDrawer: boolean
  setShowDrawer: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  // // connectorsMetadata: any
  // flowId?: Id
  // setFlowId: (id: Id) => void
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
  flow: Flow | null
  loadFlow: (id: Id) => Promise<Flow | null>
  setFlow: (flow: Flow) => void
  updateFlow: (id: Id, flow: Partial<Flow>) => Promise<void>
  // TRIGGERS
  editedTrigger: Trigger | null
  setEditedTrigger: (trigger: Trigger) => void
  updateEditedTrigger: (update: Partial<WithoutId<Trigger>>) => Promise<void>
  resetTrigger: (triggerId: Id) => Promise<void>
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
  // flowId: undefined,
  // setFlowId: (id: Id) => set(() => ({ flowId: id })),
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
    if (!updated) throw new Error(`Can not update node: ${id}, changes: ${changes}`)
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
    if (!updated) throw new Error(`Can not update egde: ${id}, changes: ${changes}`)
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    })
  },
  // FLOW
  flow: null,
  loadFlow: async (id: Id) => {
    let flow: string | Flow | null = localStorage.getItem('flow')
    if (flow) {
      flow = JSON.parse(flow) as Flow
    } else {
      const { data } = await FlowApi.get(id)
      flow = data
      localStorage.setItem('flow', JSON.stringify(flow))
    }

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
  updateEditedTrigger: async (update: Partial<Trigger>) => {
    const { editedTrigger, flow } = get()
    if (!flow) throw new Error('flow can not be empty during update')
    if (!editedTrigger) throw new Error('editedTrigger can not be empty during update')

    const newTrigger = deepMerge(editedTrigger, update)
    const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)
    if (!data) throw new Error(`Can not update flow trigger. No flowVersion in response`)

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
  resetTrigger: async (triggerId: Id) => {
    let emptyTrigger: TriggerEmpty | undefined = undefined

    // eslint-disable-next-line prefer-const
    let { nodes, flow } = get()
    if (!flow) throw new Error('Can not retrive flow')

    nodes = nodes.map((node: CustomNode) => {
      if (node.id !== triggerId) return node as CustomNode

      emptyTrigger = generateEmptyTrigger(node.data.trigger.id)
      const emptyNode = selectTriggerNodeFactory({ trigger: emptyTrigger })

      return emptyNode
    })
    if (!emptyTrigger) throw new Error(`Can not generate empty trigger`)

    flow.version.triggers = flow.version.triggers.map((trigger) => {
      if (trigger.id !== triggerId) return trigger
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return emptyTrigger!
    })
    await FlowVersionApi.updateTrigger(flow._id, emptyTrigger)

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
