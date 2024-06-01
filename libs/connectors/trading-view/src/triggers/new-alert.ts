/* eslint-disable no-useless-escape */
import { Property, createTrigger } from '@linkerry/connectors-framework'
import { TriggerStrategy } from '@linkerry/shared'
import { instructions } from '../common/instructions'

export const tradingViewNewAlert = createTrigger({
  name: 'new_alert',
  displayName: 'New Alert',
  description: 'Triggers when Trading View trigger new Alert',
  props: {
    instructions_webhook_url: Property.MarkDown({
      displayName: 'Webhook URL',
      description: instructions.instructions_webhook_url,
    }),
    instructions_message: Property.MarkDown({
      displayName: 'Alert Message',
      description: instructions.instructions_message,
    }),
  },
  type: TriggerStrategy.WEBHOOK,
  // sampleData: {
  // },
  async onEnable(context) {
    console.log('Trading View enabled')
  },
  async onDisable(context) {
    console.log('Trading View disabled')
  },
  async run(context) {
    return [context.payload.body]
  },
})
