import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { Action, ConnectorsGetOptionsResponse, DeepPartial, Flow, Id, RunActionResponse, Trigger, TriggerConnector, TriggerEvent, WithoutId } from '@linkerry/shared'
import { Dispatch, SetStateAction } from 'react'
import { Edge, OnConnect, OnEdgesChange, OnNodesChange } from 'reactflow'
import { StoreApi } from 'zustand'
import { EditorDrawer } from '../../../shared/components/drawer/types'
import { CustomEdge, CustomEdgeId } from '../edges/types'
import { CustomNode, CustomNodeId } from '../types'

// type EditorNode = Node | CustomNode
type EditorNode = CustomNode

export interface ReactFlowSlice {
	// NODES
	nodes: EditorNode[]
	setNodes: (nodes: CustomNode[]) => void
	addNode: (node: CustomNode) => void
	deleteNode: (nodeId: CustomNodeId) => void
	onNodesChange: OnNodesChange
	getNodeById: (id: string) => CustomNode | undefined
	updateNode: (nodeId: CustomNodeId, changes: DeepPartial<CustomNode>) => void
	// EDGES
	edges: Edge[]
	setEdges: (nodes: Edge[]) => void
	addEdge: (edge: Edge) => void
	onEdgesChange: OnEdgesChange
	onConnect: OnConnect
	updateEdge: (id: CustomEdgeId, changes: Partial<CustomEdge>) => void
}

export interface EditorSlice {
	drawer: EditorDrawer
	setDrawer: (name: EditorDrawer['name']) => void
	showDrawer: boolean
	setShowDrawer: Dispatch<SetStateAction<boolean>>
	isLoading: boolean
	setIsLoading: (value: boolean) => void
}

export interface FlowAndConnectorsSlice {
	// FLOW
	flow: Flow
	loadFlow: (id: Id) => Promise<Flow | null>
	setFlow: (flow: Flow) => void
	// CONNECTORS
	testConnectorLoading: boolean
	getConnectorOptions: ({ input, propertyName }: { input: any; propertyName: string }) => Promise<ConnectorsGetOptionsResponse>
}

export interface TriggersSlice {
	editedTrigger: Trigger | null
	setEditedTrigger: (trigger: Trigger) => void
	onClickSelectTrigger: (trigger: Trigger) => void
	handleSelectTriggerConnector: (connectorMetadata: ConnectorMetadataSummary) => Promise<void>
	updateEditedTrigger: (newTrigger: Trigger) => Promise<void>
	patchEditedTriggerConnector: (update: DeepPartial<WithoutId<TriggerConnector>>) => Promise<void>
	resetTrigger: (triggerName: string) => Promise<void>
	testPoolTrigger: () => Promise<TriggerEvent[]>
}

export interface ActionsSlice {
	editedAction: Action | null
	setEditedAction: (action: Action) => void
	onClickSelectAction: (nodeId: string) => void
	handleSelectActionConnector: (connectorMetadata: ConnectorMetadataSummary) => Promise<void>
	patchEditedAction: (update: DeepPartial<Action>) => Promise<void>
	updateEditedAction: (newAction: Action) => Promise<void>
	deleteAction: (actionName: string) => Promise<void>
	testAction: () => Promise<RunActionResponse | undefined>
}

export interface StepsSlice {
	// STEPS
	editStepMetadata: {
		parentNodeName: string
		actionName: string
	} | null
	setEditStepMetadata: (data: StepsSlice['editStepMetadata']) => void
}

export type EditorStore = ReactFlowSlice & EditorSlice & FlowAndConnectorsSlice & TriggersSlice & ActionsSlice & StepsSlice
export type CreateSlice<T> = (set: StoreApi<EditorStore>['setState'], get: StoreApi<EditorStore>['getState']) => T
