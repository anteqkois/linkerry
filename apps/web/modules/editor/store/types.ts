import { ConnectorMetadata, ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import {
	Action,
	ConnectorsGetOptionsResponse,
	DeepPartial,
	FlowPopulated,
	FlowStatus,
	Id,
	RunActionResponse,
	Trigger,
	TriggerConnector,
	TriggerEvent,
} from '@linkerry/shared'
import { Dispatch, SetStateAction } from 'react'
import { Edge, OnConnect, OnEdgesChange, OnNodesChange } from 'reactflow'
import { Socket } from 'socket.io-client'
import { StoreApi } from 'zustand'
import { CustomEdge, CustomEdgeId } from '../edges/types'
import { CustomNode, CustomNodeId, EditorDrawer } from '../types'

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
	patchNode: (nodeId: CustomNodeId, changes: DeepPartial<CustomNode>) => void
	// EDGES
	edges: Edge[]
	setEdges: (nodes: Edge[]) => void
	addEdge: (edge: Edge) => void
	deleteEdge: (edgeId: CustomEdgeId) => void
	onEdgesChange: OnEdgesChange
	onConnect: OnConnect
	patchEdge: (id: CustomEdgeId, changes: Partial<CustomEdge>) => void
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
	loaded: boolean
	saving: boolean
	flow: FlowPopulated
	loadFlow: (id: Id) => Promise<FlowPopulated | null>
	setFlow: (flow: FlowPopulated) => void
	publishFlow: () => Promise<void>
	setFlowStatus: (status: FlowStatus) => Promise<void>
	// CONNECTORS
	editedConnectorMetadata: ConnectorMetadata | null
	setEditedConnectorMetadata: (connectorMetadata: ConnectorMetadata | null) => void
	testConnectorLoading: boolean
	getConnectorOptions: ({ input, propertyName }: { input: any; propertyName: string }) => Promise<ConnectorsGetOptionsResponse>
}

export interface TriggersSlice {
	editedTrigger: Trigger | null
	setEditedTrigger: (trigger: Trigger) => void
	onClickSelectTrigger: (trigger: Trigger) => void
	handleSelectTriggerConnector: (connectorMetadata: ConnectorMetadataSummary) => Promise<void>
	updateEditedTrigger: (newTrigger: Trigger) => Promise<void>
	patchEditedTriggerConnector: (update: DeepPartial<Omit<TriggerConnector, '_id'>>) => Promise<void>
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
	testAction: () => Promise<Omit<RunActionResponse, 'flowVersion'> | undefined>
}

export interface StepsSlice {
	// STEPS
	editStepMetadata: {
		parentNodeName: string
		actionName: string
	} | null
	setEditStepMetadata: (data: StepsSlice['editStepMetadata']) => void
}

export interface WebSocketSlice {
	// socket: Socket<DefaultEventsMap, DefaultEventsMap>	| null
	socket: Socket | null
	initWebSocketConnection: () => void
	closeWebSocketConnection: () => Promise<void>
}

export type EditorStore = ReactFlowSlice & EditorSlice & FlowAndConnectorsSlice & TriggersSlice & ActionsSlice & StepsSlice & WebSocketSlice
export type CreateSlice<T> = (set: StoreApi<EditorStore>['setState'], get: StoreApi<EditorStore>['getState']) => T
