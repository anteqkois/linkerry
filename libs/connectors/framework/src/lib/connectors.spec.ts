import { createConnector } from './connectors'
import { Property } from './property'
import { TriggerStrategy, createTrigger } from './trigger/trigger'

describe('connector', () => {
  it('should define connector', () => {
    const trigger = createTrigger({
      type: TriggerStrategy.POLLING,
      name: 'every_x_minutes',
      displayName: 'Every x minutes',
      description: 'Call trigger every x minutes',
      props: {
        minutes: Property.Text({
          name: 'minutes',
          displayName: 'Minutes',
          required: true,
          description:''
        })
      },
      onEnable: async (ctx) => {
        ctx.propsValue.minutes
        // register schedulde
        // const cronExpression = `*/${ctx.propsValue.minutes} * * * *`
        // ctx.setSchedule({
        //     cronExpression: cronExpression,
        //     timezone: 'UTC'
        // });
      },
      onDisable: async () => {
        // remove schedulde jobs
      },
      run() {
        // const cronExpression = `*/${context.propsValue.minutes} * * * *`
        return Promise.resolve([
          {
            // cron_expression: cronExpression,
            cron_expression: '',
            timezone: 'UTC',
          },
        ])
      },
      sampleData: {},
    })

    const connector = createConnector({
      name: 'schedulde',
      displayName: 'Schedulde',
      description: 'Schedulde connector',
      logoUrl: '',
      triggers: [trigger],
      actions: [],
    })
  })
})
