import { createConnector } from './connectors'
import { ConnectorAuth, Property } from './property'
import { TriggerStrategy, createTrigger } from './trigger/trigger'

// Simple Trigger
const secretString = ConnectorAuth.SecretText({
  description:'',
  displayName:'',
  name:'',
  required: true,
})

const basicStrategy = ConnectorAuth.BasicAuth({
  description:'',
  displayName:'',
  name:'',
  required: true,
})

const authStrategy = basicStrategy

const trigger = createTrigger({
  type: TriggerStrategy.POLLING,
  name: 'every_x_minutes',
  displayName: 'Every x minutes',
  description: 'Call trigger every x minutes',
  auth: authStrategy,
  requireAuth: false,
  props: {
    minutes: Property.Text({
      name: 'minutes',
      displayName: 'Minutes',
      required: true,
      description: '',
    }),
    timezone: Property.Dropdown({
      description: '',
      displayName: 'Time Zone',
      name: 'timezone',
      required: true,
      options: [
        { label: 'First option', value: 3 },
        { label: 'Second option', value: 12 },
      ],
    }),
  },
  onEnable: async (ctx) => {
    ctx.propsValue.minutes
    ctx.propsValue.timezone = 1
    ctx.auth.password
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
  auth: authStrategy,
  requiredAuth: false,
  logoUrl: '',
  triggers: [trigger],
  actions: [],
})
