import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import {
	CustomError,
	DeepPartial,
	ErrorCode,
	FlowOperationType,
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
	retriveStepNumber,
} from '@linkerry/shared'
import { FlowApi, TriggerApi } from '../../flows'
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
				packageType: connectorMetadata.packageType,
				connectorName: connectorMetadata.name,
				connectorVersion: connectorMetadata.version,
				connectorType: connectorMetadata.connectorType,
				triggerName: '',
				input: {},
				inputUiInfo: {},
			},
			nextActionName: '',
		}

		set({
			flowOperationRunning: true,
		})
		try {
			await updateEditedTrigger(newTrigger)
			patchNode(editedTrigger.name, triggerNodeFactory({ trigger: newTrigger, connectorMetadata }))
			setRightDrawer('trigger_connector')
		} finally {
			set({
				flowOperationRunning: false,
			})
		}
	},
	updateEditedTrigger: async (newTrigger: Trigger) => {
		const { flow, setFlow, patchNode } = get()

		const { data } = await FlowApi.operation(flow._id, {
			type: FlowOperationType.UPDATE_TRIGGER,
			flowVersionId: flow.version._id,
			request: newTrigger,
		})

		patchNode(newTrigger.name, { data: { trigger: newTrigger } })

		setFlow(data)
		set({
			editedTrigger: newTrigger,
		})
	},
	patchEditedTriggerConnector: async (update: DeepPartial<TriggerConnector>) => {
		const { editedTrigger, flow, setFlow, patchNode } = get()
		set({
			flowOperationRunning: true,
		})

		try {
			if (!editedTrigger) throw new CustomError('editedTrigger can not be empty during update', ErrorCode.ENTITY_NOT_FOUND)

			const newTrigger = deepMerge(editedTrigger, update)
			if (JSON.stringify(newTrigger) === JSON.stringify(editedTrigger)) return console.log('Skip trigger update, data after merge is the same')

			const { data } = await FlowApi.operation(flow._id, {
				type: FlowOperationType.UPDATE_TRIGGER,
				flowVersionId: flow.version._id,
				request: newTrigger,
			})

			patchNode(newTrigger.name, { data: { trigger: newTrigger } })

			setFlow(data)
			set({
				editedTrigger: newTrigger,
			})
		} finally {
			set({
				flowOperationRunning: false,
			})
		}
	},
	resetTrigger: async (triggerName: string) => {
		let emptyTrigger: TriggerEmpty | undefined = undefined
		// eslint-disable-next-line prefer-const
		let { nodes, flow, setFlow, patchNode } = get()
		set({
			flowOperationRunning: true,
		})

		try {
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

			await TriggerApi.deleteAllTriggerEvents({
				flowId: flow._id,
				triggerName,
			})
			const { data } = await FlowApi.operation(flow._id, {
				type: FlowOperationType.UPDATE_TRIGGER,
				flowVersionId: flow.version._id,
				request: emptyTrigger,
			})

			patchNode(triggerName, { data: { trigger: emptyTrigger } })
			setFlow(data)
			set({
				nodes,
				showRightDrawer: true,
				rightDrawer: editorDrawers.find((entry) => entry.name === 'select_trigger'),
				editedTrigger: emptyTrigger,
			})
		} finally {
			set({
				flowOperationRunning: false,
			})
		}
	},
	testPoolTrigger: async () => {
		const { flow, setFlow, patchNode, editedTrigger } = get()
		let testResult: TriggerTestPoolResponse

		set({
			flowOperationRunning: true,
		})

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
			set({ flowOperationRunning: false })
		}

		return testResult.triggerEvents
	},
})
