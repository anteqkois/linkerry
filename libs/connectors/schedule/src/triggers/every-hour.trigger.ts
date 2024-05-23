import { Property, createTrigger } from '@linkerry/connectors-framework'
import { TriggerStrategy } from '@linkerry/shared'

export const everyHourTrigger = createTrigger({
  name: 'every_hour',
  displayName: 'Every Hour',
  description: 'Triggers the current flow every hour',
  type: TriggerStrategy.POLLING,
  requireAuth: false,
  sampleData: {},
  props: {
    run_on_weekends: Property.Checkbox({
      displayName: 'Run on weekends (Sat,Sun)',
      // name: 'run_on_weekends',
      description: 'Decide if flow should be triggered during weekends',
      required: true,
      defaultValue: false,
    }),
  },
  onEnable: async (ctx) => {
    const cronExpression = ctx.propsValue.run_on_weekends ? `0 * * * *` : `0 * * * 1-5`
    ctx.setSchedule({
      cronExpression: cronExpression,
      timezone: 'UTC',
    })
  },
  run(ctx) {
    const cronExpression = ctx.propsValue.run_on_weekends ? `0 * * * *` : `0 * * * 1-5`
    return Promise.resolve([
      {
        cron_expression: cronExpression,
        timezone: 'UTC',
      },
    ])
  },
  onDisable: async () => {
    console.info('onDisable')
  },
})
