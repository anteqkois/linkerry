import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { cronExpressionTrigger } from './triggers/cron-expression.trigger'
import { everyHourTrigger } from './triggers/every-hour.trigger'

export const schedule = createConnector({
  displayName: 'Schedule',
  logoUrl: '/images/connectors/schedule.png',
  triggers: [everyHourTrigger, cronExpressionTrigger],
  description: 'Use to schedule starting flow every X times',
  minimumSupportedRelease: '0.0.0',
  actions: [],
  auth: ConnectorAuth.None(),
  tags: ['core', 'connector', 'plan'],
})
