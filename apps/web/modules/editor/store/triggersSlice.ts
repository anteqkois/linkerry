import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import {
	CustomError,
	DeepPartial,
	ErrorCode,
	FlowPopulated,
	Trigger,
	TriggerConnector,
	TriggerEmpty,
	TriggerTestPoolResponse,
	TriggerType,
	assertNotNullOrUndefined,
	deepMerge,
	flowHelper,
	generateEmptyTrigger,
	isConnectorTrigger,
	retriveStepNumber
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
		const { setRightDrawer } = get()

		setRightDrawer('trigger_connector')
		set({
			editedTrigger: trigger,
			showRightDrawer: true,
		})
	},
	onClickSelectTrigger(trigger: Trigger) {
		const { setRightDrawer, showRightDrawer } = get()

		setRightDrawer('select_trigger')
		set({
			editedTrigger: trigger,
			showRightDrawer: !showRightDrawer,
		})
	},
	handleSelectTriggerConnector: async (connectorMetadata: ConnectorMetadataSummary) => {
		const { editedTrigger, updateEditedTrigger, patchNode, setRightDrawer } = get()
		assertNotNullOrUndefined(editedTrigger, 'editedTrigger')

		const newTrigger: TriggerConnector = {
			name: editedTrigger.name,
			displayName: connectorMetadata.displayName,
			type: TriggerType.CONNECTOR,
			valid: false,
			settings: {
				packageType:connectorMetadata.packageType,
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
		patchNode(editedTrigger.name, triggerNodeFactory({ trigger: newTrigger, connectorMetadata }))
		setRightDrawer('trigger_connector')
	},
	updateEditedTrigger: async (newTrigger: Trigger) => {
		const { flow, setFlow, patchNode } = get()

		const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)

		patchNode(newTrigger.name, { data: { trigger: newTrigger } })
		const newFlow: FlowPopulated = {
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
		const { editedTrigger, flow, setFlow, patchNode } = get()
		if (!editedTrigger) throw new CustomError('editedTrigger can not be empty during update', ErrorCode.ENTITY_NOT_FOUND)

		const newTrigger = deepMerge(editedTrigger, update)
		if (JSON.stringify(newTrigger) === JSON.stringify(editedTrigger)) return console.log('Skip trigger update, data after merge is the same')

		const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)

		patchNode(newTrigger.name, { data: { trigger: newTrigger } })
		const newFlow: FlowPopulated = {
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
		let { nodes, flow, setFlow, patchNode } = get()

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

		patchNode(triggerName, { data: { trigger: emptyTrigger } })
		setFlow(flow)
		set({
			nodes,
			showRightDrawer: true,
			rightDrawer: editorDrawers.find((entry) => entry.name === 'select_trigger'),
			editedTrigger: emptyTrigger,
		})
	},
	testPoolTrigger: async () => {
		set({ testConnectorLoading: true })
		const { flow, setFlow, patchNode, editedTrigger } = get()
		let testResult: TriggerTestPoolResponse

		try {
			assertNotNullOrUndefined(editedTrigger, 'editedTrigger')
			testResult = (
				await TriggerApi.poolTest({
					flowId: flow._id,
					triggerName: editedTrigger.name,
				})
			).data

			const trigger = flowHelper.getTrigger(testResult.flowVersion, editedTrigger.name)
			if (!trigger || !isConnectorTrigger(trigger))
				throw new CustomError(`Can not find trigger`, ErrorCode.CONNECTOR_TRIGGER_NOT_FOUND, {
					trigger,
				})

			patchNode(trigger.name, {
				data: {
					trigger,
				},
			})
			set({ editedTrigger: trigger })
			setFlow({ ...flow, version: testResult.flowVersion })
		} finally {
			set({ testConnectorLoading: false })
		}

		return testResult.triggerEvents
	},
})
