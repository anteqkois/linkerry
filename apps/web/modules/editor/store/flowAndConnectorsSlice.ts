import {
	Action,
	CustomError,
	ErrorCode,
	Flow,
	FlowState,
	FlowStatus,
	Id,
	Trigger,
	assertNotNullOrUndefined,
	isConnectorAction,
	isConnectorTrigger,
	isStepBaseSettings,
} from '@linkerry/shared'
import { FlowApi } from '../../flows'
import { ConnectorsApi } from '../../flows/connectors/api/api'
import { CreateSlice, FlowAndConnectorsSlice } from './types'

const emptyFlow: Flow = {
	_id: '1234567890',
	status: FlowStatus.Unpublished,
	user: '1234567890',
	version: {
		_id: '123456789',
		user: '1234567890',
		displayName: 'Untitled',
		state: FlowState.Draft,
		flow: '1234567890',
		valid: false,
		stepsCount: 1,
		triggers: [],
		actions: [],
	},
}

export const createFlowAndConnectorsSlice: CreateSlice<FlowAndConnectorsSlice> = (set, get) => ({
	// FLOW
	flow: emptyFlow,
	loadFlow: async (id: Id) => {
		let flow: string | Flow | null = localStorage.getItem('flow')
		if (flow) {
			flow = JSON.parse(flow) as Flow
		} else {
			const { data } = await FlowApi.get(id)
			flow = data
			localStorage.setItem('flow', JSON.stringify(flow))
		}

		assertNotNullOrUndefined(flow, 'flow')

		set({ flow })
		return flow
	},
	setFlow: (flow: Flow) => {
		set({ flow })
		localStorage.setItem('flow', JSON.stringify(flow))
	},
	// CONNECTORS
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
			connectorName: settings.connectorName,
			connectorType: settings.connectorType,
			connectorVersion: settings.connectorVersion,
			stepName,
			flowId: flow._id,
			flowVersionId: flow.version._id,
			input,
			propertyName,
		})

		return response.data
	},
})
