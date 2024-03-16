import { ConnectorMetadata } from '@linkerry/connectors-framework'
import {
	Action,
	CustomError,
	ErrorCode,
	FlowPopulated,
	FlowRun,
	FlowRunWSInput,
	FlowStatus,
	FlowVersionState,
	Id,
	Trigger,
	WEBSOCKET_EVENT,
	assertNotNullOrUndefined,
	isConnectorAction,
	isConnectorTrigger,
	isStepBaseSettings,
} from '@linkerry/shared'
import { FlowApi } from '../../flows'
import { ConnectorsApi } from '../../flows/connectors/api/api'
import { CreateSlice, FlowAndConnectorsSlice } from './types'

const emptyFlow: FlowPopulated = {
	_id: '1234567890',
	status: FlowStatus.DISABLED,
	projectId: '1919191919',
	version: {
		_id: '123456789',
		projectId: '1919191919',
		displayName: 'Untitled',
		state: FlowVersionState.DRAFT,
		flow: '1234567890',
		valid: false,
		stepsCount: 1,
		triggers: [],
		actions: [],
		updatedBy: 'unknown',
		createdAt: '',
		updatedAt: '',
	},
	publishedVersionId: null,
	schedule: null,
	createdAt: '',
	updatedAt: '',
}

export const createFlowAndConnectorsSlice: CreateSlice<FlowAndConnectorsSlice> = (set, get) => ({
	// FLOW
	loaded: false,
	saving: false,
	flow: emptyFlow,
	loadFlow: async (id: Id) => {
		let flow: string | FlowPopulated | null = localStorage.getItem('flow')
		if (flow) {
			flow = JSON.parse(flow) as FlowPopulated
		} else {
			const { data } = await FlowApi.get(id)
			flow = data
			localStorage.setItem('flow', JSON.stringify(flow))
		}

		assertNotNullOrUndefined(flow, 'flow')

		set({ flow, loaded: true })
		return flow
	},
	setFlow: (flow: FlowPopulated) => {
		set({ flow })
		localStorage.setItem('flow', JSON.stringify(flow))
	},
	publishFlow: async () => {
		const { flow, setFlow } = get()
		set({
			saving: true,
		})

		try {
			const { data } = await FlowApi.publish(flow._id, {
				flowVersionId: flow.version._id,
			})
			setFlow(data)
		} finally {
			set({
				saving: false,
			})
		}
	},
	setFlowStatus: async (status: FlowStatus) => {
		const { flow, setFlow } = get()
		set({
			saving: true,
		})

		try {
			const { data } = await FlowApi.changeStatus(flow._id, {
				newStatus: status,
			})
			setFlow(data)
		} finally {
			set({
				saving: false,
			})
		}
	},
	testingFlowVersion: false,
	async testFlowVersion() {
		const {  flow, initWebSocketConnection , closeWebSocketConnection} = get()
		const socket = initWebSocketConnection()
		assertNotNullOrUndefined(socket, 'socket')

		socket.emit(WEBSOCKET_EVENT.TEST_FLOW, { flowVersionId: flow.version._id, projectId: flow.projectId } as FlowRunWSInput)
		set({
			testingFlowVersion: true,
		})

		socket.on(WEBSOCKET_EVENT.TEST_FLOW_STARTED, (flowRun: FlowRun) => {
			console.log('START', flowRun)
		})

		socket.on(WEBSOCKET_EVENT.TEST_FLOW_FINISHED, (flowRun: FlowRun) => {
			console.log('FINISH', flowRun)

			// disconnecte from websocket
			socket.off(WEBSOCKET_EVENT.TEST_FLOW_STARTED)
			socket.off(WEBSOCKET_EVENT.TEST_FLOW_FINISHED)

			closeWebSocketConnection()
		})
	},
	// CONNECTORS
	editedConnectorMetadata: null,
	setEditedConnectorMetadata: (connectorMetadata: ConnectorMetadata | null) => {
		set({
			editedConnectorMetadata: connectorMetadata,
		})
	},
	testConnectorLoading: false,
	getConnectorOptions: async ({ input, propertyName }: { input: any; propertyName: string }) => {
		const { editedAction, editedTrigger, flow } = get()

		let stepName: string
		let editedStep: Trigger | Action

		if (editedAction && isConnectorAction(editedAction)) {
			stepName = editedAction.settings.actionName
			editedStep = editedAction
		} else if (editedTrigger && isConnectorTrigger(editedTrigger)) {
			stepName = editedTrigger.settings.triggerName
			editedStep = editedTrigger
		} else {
			throw new CustomError('Invalid step type or data unset', ErrorCode.ENTITY_NOT_FOUND, {
				editedAction,
				editedTrigger,
			})
		}

		assertNotNullOrUndefined(editedStep, 'editedStep')
		const settings = editedStep.settings

		if (!isStepBaseSettings(settings))
			throw new CustomError(`Invalid step settings`, ErrorCode.INVALID_TYPE, {
				settings,
			})

		const response = await ConnectorsApi.getOptions({
			packageType: settings.packageType,
			connectorName: settings.connectorName,
			connectorType: settings.connectorType,
			connectorVersion: settings.connectorVersion,
			stepName,
			flowId: flow._id,
			flowVersionId: flow.version._id,
			input,
			propertyName,
			// TODO implement searchValue
			// searchValue
		})

		return response.data
	},
})
