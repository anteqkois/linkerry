import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import {
	CustomError,
	DeepPartial,
	ErrorCode,
	Flow,
	FlowVersion,
	Trigger,
	TriggerConnector,
	TriggerEmpty,
	TriggerEvent,
	TriggerType,
	assertNotNullOrUndefined,
	deepMerge,
	flowHelper,
	generateEmptyTrigger,
	isConnectorTrigger,
	retriveStepNumber,
} from '@linkerry/shared'
import { FlowVersionApi, TriggerApi } from '../../flows'
import { selectTriggerNodeFactory, triggerNodeFactory } from '../common/nodeFactory'
import { CustomNode } from '../types'
import { editorDrawers } from './editorSlice'
import { CreateSlice, TriggersSlice } from './types'

export const createTriggersSlice: CreateSlice<TriggersSlice> = (set, get) => ({
	// TRIGGERS
	editedTrigger: null,
	setEditedTrigger: (trigger: Trigger) => {
		const { setDrawer } = get()

		setDrawer('trigger_connector')
		set({
			editedTrigger: trigger,
			showDrawer: true,
		})
	},
	onClickSelectTrigger(trigger: Trigger) {
		const { setDrawer, showDrawer } = get()

		setDrawer('select_trigger')
		set({
			editedTrigger: trigger,
			showDrawer: !showDrawer,
		})
	},
	handleSelectTriggerConnector: async (connectorMetadata: ConnectorMetadataSummary) => {
		const { editedTrigger, updateEditedTrigger, updateNode, setDrawer } = get()
		assertNotNullOrUndefined(editedTrigger, 'editedTrigger')

		const newTrigger: TriggerConnector = {
			name: editedTrigger.name,
			displayName: connectorMetadata.displayName,
			type: TriggerType.CONNECTOR,
			valid: false,
			settings: {
				connectorName: connectorMetadata.name,
				connectorVersion: connectorMetadata.version,
				connectorType: connectorMetadata.connectorType,
				triggerName: '',
				input: {},
				inputUiInfo: {},
			},
			nextActionName: '',
		}

		await updateEditedTrigger(newTrigger)
		updateNode(editedTrigger.name, triggerNodeFactory({ trigger: newTrigger, connectorMetadata }))
		setDrawer('trigger_connector')
	},
	updateEditedTrigger: async (newTrigger: Trigger) => {
		const { flow, setFlow } = get()

		const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)

		const newFlow: Flow = {
			...flow,
			version: data,
		}

		setFlow(newFlow)
		set({
			editedTrigger: newTrigger,
			flow: newFlow,
		})
	},
	patchEditedTriggerConnector: async (update: DeepPartial<TriggerConnector>) => {
		const { editedTrigger, flow, setFlow } = get()
		if (!editedTrigger) throw new CustomError('editedTrigger can not be empty during update', ErrorCode.ENTITY_NOT_FOUND)

		const newTrigger = deepMerge(editedTrigger, update)
		if (JSON.stringify(newTrigger) === JSON.stringify(editedTrigger)) return console.log('Skip trigger update, data after merge is the same')

		const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)

		const newFlow: Flow = {
			...flow,
			version: data,
		}

		setFlow(newFlow)
		set({
			editedTrigger: newTrigger,
			flow: newFlow,
		})
	},
	resetTrigger: async (triggerName: string) => {
		let emptyTrigger: TriggerEmpty | undefined = undefined
		// eslint-disable-next-line prefer-const
		let { nodes, flow, setFlow } = get()

		const stepNumber = retriveStepNumber(triggerName)
		nodes = nodes.map((node: CustomNode) => {
			if (node.id !== triggerName) return node as CustomNode

			emptyTrigger = generateEmptyTrigger(`trigger_${stepNumber}`)
			const emptyNode = selectTriggerNodeFactory({ trigger: emptyTrigger })

			return emptyNode
		})
		if (!emptyTrigger)
			throw new CustomError(`Can not find trigger to reset`, ErrorCode.ENTITY_NOT_FOUND, {
				triggerName,
			})

		flow.version.triggers = flow.version.triggers.map((trigger) => {
			if (trigger.name !== triggerName) return trigger
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return emptyTrigger!
		})
		await TriggerApi.deleteAllTriggerEvents({
			flowId: flow._id,
			triggerName,
		})
		await FlowVersionApi.updateTrigger(flow.version._id, emptyTrigger)

		setFlow(flow)
		set({
			nodes,
			showDrawer: true,
			drawer: editorDrawers.find((entry) => entry.name === 'select_trigger'),
			editedTrigger: emptyTrigger,
		})
	},
	testPoolTrigger: async () => {
		set({ testConnectorLoading: true })
		const { flow, setFlow, updateNode, editedTrigger } = get()
		assertNotNullOrUndefined(editedTrigger, 'editedTrigger')
		let newFlowVersion: FlowVersion | undefined = undefined
		let testResult: TriggerEvent[] = []

		try {
			testResult = (
				await TriggerApi.poolTest({
					flowId: flow._id,
					triggerName: editedTrigger.name,
				})
			).data

			const trigger = flowHelper.getTrigger(flow.version, editedTrigger.name)
			if (!trigger || !isConnectorTrigger(trigger))
				throw new CustomError(`Can not find trigger`, ErrorCode.CONNECTOR_TRIGGER_NOT_FOUND, {
					trigger,
				})

			trigger.settings.inputUiInfo = {
				currentSelectedData: testResult[0].payload,
				lastTestDate: testResult[0].createdAt,
			}
			trigger.valid = true

			updateNode(trigger.name, {
				data: {
					trigger,
				},
			})
			newFlowVersion = flowHelper.updateTrigger(flow.version, trigger)
			setFlow({ ...flow, version: newFlowVersion })
		} finally {
			set({ testConnectorLoading: false })
		}

		return testResult
	},
})
