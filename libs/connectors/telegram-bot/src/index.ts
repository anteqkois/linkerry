import { HttpMethod, HttpRequest, createCustomApiCallAction, httpClient } from '@linkerry/connectors-common'
import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { HttpStatusCode, isAxiosError } from 'axios'
import { telegramCreateInviteLinkAction } from './actions/create-invite-link'
import { telegramGetChatMemberAction } from './actions/get-chat-member'
import { telegramSendMediaAction } from './actions/send-media.action'
import { telegramSendMessageAction } from './actions/send-text-message'
import { telegramCommons } from './common'
import { telegramNewMessage } from './triggers/new-message'
import { GetMe } from './types/getMe'

const markdownDescription = `**Authentication**:

1. Start a conversation with the [Botfather](https://telegram.me/BotFather).
2. Type in "/newbot"
3. Select a name for your bot.
4. Choose a username for your bot.
5. Copy the token value provided by the Botfather and use it to activate the connection.
6. Congratulations! You can now utilize your new Telegram connection within your flows.`

export const telegramBotAuth = ConnectorAuth.SecretText({
	displayName: 'Bot Token',
	description: markdownDescription,
	required: true,
	validate: async ({ auth }) => {
		const request: HttpRequest = {
			method: HttpMethod.GET,
			url: telegramCommons.getApiUrl(auth, 'getMe'),
		}

		try {
			const response = await httpClient.sendRequest<GetMe>(request)

			if (response.body.ok)
				return {
					valid: true,
				}
			else
				return {
					valid: true,
					error: 'Invalid Bot Token',
				}
		} catch (error: any) {
			if (isAxiosError(error)) {
				if (error.status === HttpStatusCode.NotFound)
					return {
						valid: false,
						error: 'Invalid Bot Token, bot not found',
					}
				else
					return {
						valid: false,
						error: error.response?.data?.description,
					}
			}

			return {
				valid: false,
				error: error?.message,
			}
		}
	},
})

export const telegramBot = createConnector({
	displayName: 'Telegram Bot',
	description: 'Build chatbots for Telegram',
	minimumSupportedRelease: '0.0.0',
	logoUrl:
		'/images/connectors/telegram-bot.png',
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
