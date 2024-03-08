import { ConnectorMetadata } from '@linkerry/connectors-framework'
import {
	Action,
	CustomError,
	ErrorCode,
	FlowStatus,
	FlowVersionState,
	Id,
	PopulatedFlow,
	Trigger,
	assertNotNullOrUndefined,
	isConnectorAction,
	isConnectorTrigger,
	isStepBaseSettings
} from '@linkerry/shared'
import { FlowApi } from '../../flows'
import { ConnectorsApi } from '../../flows/connectors/api/api'
import { CreateSlice, FlowAndConnectorsSlice } from './types'

const emptyFlow: PopulatedFlow = {
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
		updatedBy: 'unknown'
	},
	publishedVersionId: null,
	schedule: null,
}

export const createFlowAndConnectorsSlice: CreateSlice<FlowAndConnectorsSlice> = (set, get) => ({
	// FLOW
	loaded: false,
	publishLoading: false,
	flow: emptyFlow,
	loadFlow: async (id: Id) => {
		let flow: string | PopulatedFlow | null = localStorage.getItem('flow')
		if (flow) {
			flow = JSON.parse(flow) as PopulatedFlow
		} else {
			const { data } = await FlowApi.get(id)
			flow = data
			localStorage.setItem('flow', JSON.stringify(flow))
		}

		assertNotNullOrUndefined(flow, 'flow')

		set({ flow, loaded: true })
		return flow
	},
	setFlow: (flow: PopulatedFlow) => {
		set({ flow })
		localStorage.setItem('flow', JSON.stringify(flow))
	},
	publishFlow: async () => {
		const { flow } = get()
		set({
			publishLoading: true,
		})

		let newFlow: PopulatedFlow | undefined
		try {
			const { data } = await FlowApi.publish(flow._id, {
				flowVersionId: flow.version._id,
			})
			newFlow = data
		} finally {
			if (newFlow) {
				set({
					flow: newFlow,
					publishLoading: false,
				})
			} else {
				set({
					publishLoading: false,
				})
			}
		}
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
