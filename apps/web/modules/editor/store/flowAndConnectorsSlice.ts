import { ConnectorMetadata } from '@linkerry/connectors-framework'
import {
	Action,
	CustomError,
	CustomWebSocketExceptionResponse,
	ErrorCode,
	FlowOperationType,
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
	flowOperationRunning: false,
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
			flowOperationRunning: true,
		})

		try {
			const { data } = await FlowApi.operation(flow._id, {
				type: FlowOperationType.LOCK_AND_PUBLISH,
				flowVersionId: flow.version._id,
				request: {},
			})

			setFlow(data)
		} finally {
			set({
				flowOperationRunning: false,
			})
		}
	},
	setFlowStatus: async (status: FlowStatus) => {
		const { flow, setFlow } = get()
		set({
			flowOperationRunning: true,
		})

		try {
			const { data } = await FlowApi.operation(flow._id, {
				type: FlowOperationType.CHANGE_STATUS,
				flowVersionId: flow.version._id,
				request: {
					status
				},
			})
			setFlow(data)
		} finally {
			set({
				flowOperationRunning: false,
			})
		}
	},
	testingFlowVersion: false,
	flowRun: null,
	async testFlowVersion() {
		const { onSelectFlowRun, setLeftDrawer, flow, initWebSocketConnection, closeWebSocketConnection } = get()
		const socket = initWebSocketConnection()
		assertNotNullOrUndefined(socket, 'socket')

		return new Promise((resolve, reject) => {
			socket.emit(WEBSOCKET_EVENT.TEST_FLOW, { flowVersionId: flow.version._id, projectId: flow.projectId } as FlowRunWSInput)

			setLeftDrawer('flow_testing')
			set({
				showLeftDrawer: true,
				testingFlowVersion: true,
			})

			socket.on(WEBSOCKET_EVENT.EXCEPTION, (error: CustomWebSocketExceptionResponse) => {
				set({
					testingFlowVersion: false,
				})

				socket.off(WEBSOCKET_EVENT.TEST_FLOW_STARTED)
				socket.off(WEBSOCKET_EVENT.TEST_FLOW_FINISHED)

				closeWebSocketConnection()
				console.log(error.message)
				return reject(error.message)
			})

			socket.on(WEBSOCKET_EVENT.TEST_FLOW_STARTED, (flowRun: FlowRun) => {
				set({
					flowRun,
				})
			})

			socket.on(WEBSOCKET_EVENT.TEST_FLOW_FINISHED, async (flowRun: FlowRun) => {
				set({
					testingFlowVersion: false,
					flowRun,
					selectedFlowRunId: flowRun._id,
				})

				socket.off(WEBSOCKET_EVENT.TEST_FLOW_STARTED)
				socket.off(WEBSOCKET_EVENT.TEST_FLOW_FINISHED)

				closeWebSocketConnection()

				await onSelectFlowRun(flowRun._id)
				return resolve(flowRun)
			})
		})
	},
	onClickFlowRuns: () => {
		const { setLeftDrawer } = get()

		setLeftDrawer('flow_runs_list')

		set({
			showLeftDrawer: true,
		})
	},
	selectedFlowRunId: null,
	onSelectFlowRun: (flowRunId: string) => {
		const { setLeftDrawer } = get()

		setLeftDrawer('flow_run')

		set({
			showLeftDrawer: true,
			selectedFlowRunId: flowRunId,
		})
	},
	// CONNECTORS
	editedConnectorMetadata: null,
	setEditedConnectorMetadata: (connectorMetadata: ConnectorMetadata | null) => {
		set({
			editedConnectorMetadata: connectorMetadata,
		})
	},
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
