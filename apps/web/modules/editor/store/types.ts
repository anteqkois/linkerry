import {
    Action,
    ConnectorsGetOptionsResponse,
    DeepPartial,
    FlowPopulated,
    FlowRun,
    FlowStatus,
    Id,
    RunActionResponse,
    Trigger,
    TriggerConnector,
    TriggerEvent,
    WEBSOCKET_NAMESPACE,
} from '@linkerry/shared'
import { Dispatch, SetStateAction } from 'react'
import { Edge, OnConnect, OnEdgesChange, OnNodesChange } from 'reactflow'
import { Socket } from 'socket.io-client'
import { StoreApi } from 'zustand'
import { CustomEdge, CustomEdgeId } from '../edges/types'
import { CustomNode, CustomNodeId, EditorDrawer, EditorLimits } from '../types'
import { ConnectorMetadata, ConnectorMetadataSummary } from '@linkerry/connectors-framework'

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
	useLocalStorage: boolean
	setUseLocalStorage: (newState: boolean) => void
	isLoading: boolean
	setIsLoading: (value: boolean) => void
	limits: EditorLimits
	setLimits: (newLimits: EditorLimits) => void
	rightDrawer: EditorDrawer
	setRightDrawer: (name: EditorDrawer['name']) => void
	showRightDrawer: boolean
	setShowRightDrawer: Dispatch<SetStateAction<boolean>>
	leftDrawer: EditorDrawer
	setLeftDrawer: (name: EditorDrawer['name']) => void
	showLeftDrawer: boolean
	setShowLeftDrawer: Dispatch<SetStateAction<boolean>>
}

export interface FlowAndConnectorsSlice {
	// FLOW
	loaded: boolean
	flowOperationRunning: boolean
	flow: FlowPopulated
	loadFlow: (id: Id) => Promise<FlowPopulated | null>
	setFlow: (flow: FlowPopulated) => void
	publishFlow: () => Promise<void>
	setFlowStatus: (status: FlowStatus) => Promise<void>
	testingFlowVersion: boolean
	flowRun: FlowRun | null
	testFlowVersion: () => Promise<FlowRun>
	onClickFlowRuns: () => void
	selectedFlowRunId: Id | null
	onSelectFlowRun: (flowRunId: string) => void
	updateFlowVersionDisplayName: (newName: string) => Promise<void>
	// CONNECTORS
	editedConnectorMetadata: ConnectorMetadata | null
	setEditedConnectorMetadata: (connectorMetadata: ConnectorMetadata | null) => void
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
	testWebhookTrigger: () => Promise<TriggerEvent[] | string>
	webhookTriggerWatcherWorks: boolean
	cancelWebhookTrigger: () => Promise<void>
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
	initWebSocketConnection: ({ namespace }: { namespace: WEBSOCKET_NAMESPACE }) => Socket
	closeWebSocketConnection: () => Promise<void>
}

export interface DynamicValueSlice {
	showDynamicValueModal: boolean
	onSelectDynamicValueCallback: ((tokenString: string, data: any) => Promise<void>) | null
	setShowDynamicValueModal: (newState: boolean, onSelectDynamicValueCallback?: (tokenString: string, data: any) => Promise<void>) => void
}

export type EditorStore = ReactFlowSlice &
	EditorSlice &
	FlowAndConnectorsSlice &
	TriggersSlice &
	ActionsSlice &
	StepsSlice &
	WebSocketSlice &
	DynamicValueSlice
export type CreateSlice<T> = (set: StoreApi<EditorStore>['setState'], get: StoreApi<EditorStore>['getState']) => T
