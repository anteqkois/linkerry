import { createCustomApiCallAction } from '@linkerry/connectors-common'
import { createConnector } from '@linkerry/connectors-framework'
import { telegramCreateInviteLinkAction } from './actions/create-invite-link'
import { telegramGetChatMemberAction } from './actions/get-chat-member'
import { telegramSendMediaAction } from './actions/send-media.action'
import { telegramSendMessageAction } from './actions/send-text-message'
import { telegramBotAuth } from './common/auth'
import { telegramCommons } from './common/common'
import { telegramNewMessage } from './triggers/new-message'

export const telegramBot = createConnector({
  displayName: 'Telegram Bot',
  description: 'Build chatbots for Telegram',
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/telegram.png',
  tags: ['communication', 'bots', 'cryptocurrency'],
  auth: telegramBotAuth,
  actions: [
    telegramSendMessageAction,
    telegramSendMediaAction,
    telegramGetChatMemberAction,
    telegramCreateInviteLinkAction,
    createCustomApiCallAction({
      baseUrl: (auth) => telegramCommons.getApiUrl(auth as string, ''),
      auth: telegramBotAuth,
    }),
  ],
  triggers: [telegramNewMessage],
})
