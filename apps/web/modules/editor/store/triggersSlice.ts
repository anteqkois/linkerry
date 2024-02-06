import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { CustomError, DeepPartial, ErrorCode, Flow, FlowVersion, Trigger, TriggerConnector, TriggerEmpty, TriggerEvent, TriggerType, assertNotNullOrUndefined, deepMerge, flowHelper, generateEmptyTrigger, isConnectorTrigger, isCustomHttpExceptionAxios, retriveStepNumber } from '@linkerry/shared'
import { FlowVersionApi, TriggerApi } from '../../flows'
import { selectTriggerNodeFactory, triggerNodeFactory } from '../common/nodeFactory'
import { CustomNode } from '../types'
import { editorDrawers } from './editorSlice'
import { CreateSlice, TriggersSlice } from './types'

export const createTriggersSlice: CreateSlice<TriggersSlice> = (set, get) => ({
	// TRIGGERS
	editedTrigger: null,
	setEditedTrigger: (trigger: Trigger) => {
		const { setDrawer, showDrawer } = get()

		setDrawer('trigger_connector')
		set({
			editedTrigger: trigger,
			showDrawer: !showDrawer,
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
		if (!data) throw new CustomError(`Can not update flow trigger. Missing flow-version in response`)

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
		if (!editedTrigger) throw new CustomError('editedTrigger can not be empty during update')

		const newTrigger = deepMerge(editedTrigger, update)
		const { data } = await FlowVersionApi.updateTrigger(flow.version._id, newTrigger)
		if (!data) throw new CustomError(`Can not update flow trigger. No flowVersion in response`)

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
		if (!flow) throw new CustomError('Can not retrive flow')

		const stepNumber = retriveStepNumber(triggerName)
		nodes = nodes.map((node: CustomNode) => {
			if (node.id !== triggerName) return node as CustomNode

			emptyTrigger = generateEmptyTrigger(`trigger_${stepNumber}`)
			const emptyNode = selectTriggerNodeFactory({ trigger: emptyTrigger })

			return emptyNode
		})
		if (!emptyTrigger) throw new CustomError(`Can not generate empty trigger`)

		flow.version.triggers = flow.version.triggers.map((trigger) => {
			if (trigger.name !== triggerName) return trigger
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return emptyTrigger!
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
	testPoolTrigger: async (triggerName: string) => {
		set({ testConnectorLoading: true })
		const { flow, setFlow, updateNode } = get()
		let newFlowVersion: FlowVersion | undefined = undefined
		let testResult: TriggerEvent[] = []

		try {
			testResult = (
				await TriggerApi.poolTest({
					flowId: flow._id,
					triggerName,
				})
			).data

			const trigger = flowHelper.getTrigger(flow.version, triggerName)
			if (!trigger || !isConnectorTrigger(trigger))
				throw new CustomError({
					code: ErrorCode.CONNECTOR_TRIGGER_NOT_FOUND,
					params: {
						message: `Can not find trigger`,
					},
				})

			trigger.settings.inputUiInfo = {
				currentSelectedData: testResult[0],
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
		} catch (error) {
			if (isCustomHttpExceptionAxios(error)) {
				console.log(error.response.data)
			} else console.log(error)
		}

		set({ testConnectorLoading: false })
		return testResult
	},
})
