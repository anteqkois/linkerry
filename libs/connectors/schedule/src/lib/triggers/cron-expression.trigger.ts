import { Property, TriggerStrategy, Validators, createTrigger } from '@market-connector/connectors-framework'
import { timezoneOptions } from '../common'

export const cronExpressionTrigger = createTrigger({
	name: 'cron_expression',
	displayName: 'Cron Expression',
	description: 'Trigger based on cron expression',
	props: {
		expression: Property.Text({
			name: 'expression',
			displayName: 'Cron Expression',
			description: 'Cron expression to trigger',
			required: true,
			defaultValue: '0/5 * * * *',
			validators: [Validators.pattern(/^((\*|[0-5]?\d)(-([0-5]?\d)(\/\d+)?)?(,(?=\S))?){5}$/)],
		}),
		timezone: Property.StaticDropdown<string>({
			displayName: 'Timezone',
			name: 'timezone',
			description: 'Timezone to use',
			options: {
				options: timezoneOptions,
			},
			required: true,
			defaultValue: 'UTC',
		}),
	},
	type: TriggerStrategy.POLLING,
	sampleData: {},
	onEnable: async (ctx) => {
		ctx.setSchedule({
			cronExpression: ctx.propsValue.expression,
			timezone: ctx.propsValue.timezone,
		})
	},
	run(context) {
		return Promise.resolve([{}])
	},
	onDisable: async () => {
		console.log('onDisable')
	},
})
