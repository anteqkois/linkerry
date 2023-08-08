import {
  Connection,
  Edge,
  Node,
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

interface IStrategiesState {
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  lastConditionId: number
  nodes: Node[]
  setNodes: (nodes: Node[]) => void
  addNode: (node: Node) => void
  edges: Edge[]
  setEdges: (nodes: Edge[]) => void
  onNodesChange: OnNodesChange
  onEdgesChange: OnEdgesChange
  onConnect: OnConnect
  // handleAddNode: (...rest: any) => void
}

export const useStrategiesStore = create<IStrategiesState>((set, get) => ({
  isLoading: false,
  setIsLoading: (value: boolean) => set((state) => ({ isLoading: value })),
  lastConditionId: 1,
  nodes: [],
  setNodes: (nodes: Node[]) => set((state) => ({ nodes })),
  addNode: (node: Node) => set((state) => ({ nodes: [...state.nodes, node] })),
  edges: [],
  setEdges: (edges: Edge[]) => set((state) => ({ edges })),
  addEdge: (edge: Edge) => set((state) => ({ edges: [...state.edges, edge] })),
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
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
  // handleAddNode: (...rest: any) => void
}))
