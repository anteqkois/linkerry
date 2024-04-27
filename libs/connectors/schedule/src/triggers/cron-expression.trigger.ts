import { Property, createTrigger } from '@linkerry/connectors-framework'
import { TriggerStrategy } from '@linkerry/shared'
import { timezoneOptions } from '../common'

export const cronExpressionTrigger = createTrigger({
	name: 'cron_expression',
	displayName: 'Cron Expression',
	description: 'Trigger based on cron expression',
	requireAuth: false,
	props: {
		expression: Property.ShortText({
			displayName: 'Cron Expression',
			description: 'Cron expression to trigger',
			required: true,
			defaultValue: '0/5 * * * *',
			// validators: [Validators.pattern(/(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|([\d*]+(\/|-)\d+)|\d+|\*) ?){5,7})/)],
			// in db: (@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\d+(ns|us|µs|ms|s|m|h))+)|((((\d+,)+\d+|([\d*]+(\/|-)\d+)|\d+|\*) ?){5,7})
		}),
		timezone: Property.StaticDropdown<string>({
			displayName: 'Timezone',
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
		console.info('onDisable')
	},
})
