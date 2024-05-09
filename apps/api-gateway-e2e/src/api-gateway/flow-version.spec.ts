import { ConnectorType, ErrorCode, Flow, FlowVersion, TriggerConnector, TriggerType, isConnectorTrigger } from '@linkerry/shared'
import axios from 'axios'
import { login } from '../support/login'

const mockedConnector = {
	_id: '658c59e19217b0d5c8e7927f',
	displayName: 'Schedule',
	name: '@linkerry/linkerry-schedule',
	description: 'Use to schedule starting flow every X times',
	auth: null,
	minimumSupportedRelease: '0.0.0',
	maximumSupportedRelease: '9999.9999.9999',
	tags: ['core', 'connector', 'plan'],
	version: '0.0.1',
}

const mockedTrigger = {
	name: 'cron_expression',
	displayName: 'Cron Expression',
	description: 'Trigger based on cron expression',
	props: {
		expression: {
			name: 'expression',
			displayName: 'Cron Expression',
			description: 'Cron expression to trigger',
			required: true,
			defaultValue: '0/5 * * * *',
			type: 'ShortText',
		},
		timezone: {
			displayName: 'Timezone',
			name: 'timezone',
			description: 'Timezone to use',
			options: {
				options: [
					{
						label: '(GMT+02:00) Europe, Vienna',
						value: 'Europe/Vienna',
					},
					{
						label: '(GMT+02:00) Europe, Warsaw',
						value: 'Europe/Warsaw',
					},
					{
						label: '(GMT+02:00) Europe, Zagreb',
						value: 'Europe/Zagreb',
					},
					{
						label: '(GMT-2:00) Pacific, Midway',
						value: 'Pacific/Midway',
					},
					{
						label: '(GMT-11:00) Pacific, Niue',
						value: 'Pacific/Niue',
					},
					{
						label: '(GMT-11:00) Pacific, Pago Pago',
						value: 'Pacific/Pago_Pago',
					},
					{
						label: '(GMT-10:00) Pacific, Honolulu',
						value: 'Pacific/Honolulu',
					},
					{
						label: '(GMT-10:00) Pacific, Rarotonga',
						value: 'Pacific/Rarotonga',
					},
				],
			},
			required: true,
			defaultValue: 'UTC',
			type: 'StaticDropdown',
		},
	},
	type: 'POLLING',
	handshakeConfiguration: {
		strategy: 'NONE',
	},
	requireAuth: false,
	sampleData: {},
}

describe('POST /api/flows-version', () => {
	let flowVersion: FlowVersion

	beforeAll(async () => {
		await login()
		const { data } = await axios.post<Flow>(`/flows`)
		flowVersion = data.version as FlowVersion
	})

	afterAll(async () => {
		await axios.delete<FlowVersion>(`/flows/${flowVersion.flowId}`)
	})

	it('created flow with version', async () => {
		expect(flowVersion).toBeInstanceOf(Object)
	})

	it('save default values trigger', async () => {
		const input: TriggerConnector = {
			displayName: 'Coingecko',
			name: 'trigger_1',
			type: TriggerType.CONNECTOR,
			valid: false,
			settings: {
				connectorType: ConnectorType.OFFICIAL,
				triggerName: mockedTrigger.name,
				connectorName: mockedConnector.name,
				connectorVersion: mockedConnector.version,
				input: {
					// include trigger props choosen by user
					// auth: "{{connections['google-sheets']}}",
					expression: mockedTrigger.props.expression.defaultValue,
					timezone: mockedTrigger.props.timezone.defaultValue,
				},
				inputUiInfo: {},
			},
			nextActionName: '',
		}

		const { data } = await axios.patch<FlowVersion>(`/flow-versions/${flowVersion._id}/triggers`, input)
		flowVersion = data
		const updatedTrigger = data.triggers[0]

		expect(isConnectorTrigger(updatedTrigger)).toBeTruthy()
		if (isConnectorTrigger(updatedTrigger)) {
			expect(updatedTrigger.displayName).toBe(input.displayName)
			expect(updatedTrigger.settings.input.expression).toBe(mockedTrigger.props.expression.defaultValue)
			expect(updatedTrigger.settings.input.timezone).toBe(mockedTrigger.props.timezone.defaultValue)
		}
	})

	it('update trigger', async () => {
		const input = flowVersion.triggers[0]
		if (!isConnectorTrigger(input)) throw new Error('Invalid trigger')

		const newExpression = '1 * * * *'
		const newTimezone = mockedTrigger.props.timezone.options.options.find((entry) => entry.value === 'Europe/Warsaw').value
		input.settings.input.expression = newExpression
		input.settings.input.timezone = newTimezone

		const { data } = await axios.patch<FlowVersion>(`/flow-versions/${flowVersion._id}/triggers`, input)
		flowVersion = data
		const updatedTrigger = data.triggers[0]

		expect(isConnectorTrigger(updatedTrigger)).toBeTruthy()
		if (isConnectorTrigger(updatedTrigger)) {
			expect(updatedTrigger.displayName).toBe(input.displayName)
			expect(updatedTrigger.type).toBe(input.type)
			expect(updatedTrigger.valid).toBe(false)
			expect(updatedTrigger.settings.connectorName).toBe(input.settings.connectorName)
			expect(updatedTrigger.settings.connectorVersion).toBe(input.settings.connectorVersion)
			expect(updatedTrigger.settings.input.expression).toBe(input.settings.input.expression)
			expect(updatedTrigger.settings.input.timezone).toBe(input.settings.input.timezone)
		}
	})

	it('should throw validation error', async () => {
		const input: TriggerConnector = {
			displayName: 'Coingecko',
			name: 'trigger_1',
			type: TriggerType.CONNECTOR,
			valid: false,
			settings: {
				connectorType: ConnectorType.OFFICIAL,
				// triggerName: mockedTrigger.name,
				connectorName: mockedConnector.name,
				connectorVersion: mockedConnector.version,
				input: {
					// include trigger props choosen by user
					// auth: "{{connections['google-sheets']}}",
					expression: mockedTrigger.props.expression.defaultValue,
					timezone: mockedTrigger.props.timezone.defaultValue,
				},
				inputUiInfo: {},
			},
			nextActionName: '',
		}

		const res = axios.patch<FlowVersion>(`/flow-versions/${flowVersion._id}/triggers`, input)
		await expect(res).rejects.toHaveProperty('response.status', 422)
		await expect(res).rejects.toHaveProperty('response.data.code', ErrorCode.VALIDATION)
	})
})
