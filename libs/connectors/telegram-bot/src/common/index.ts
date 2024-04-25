import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common'
import { Property } from '@linkerry/connectors-framework'
import { chatId, formatOptions } from './instructions'

export type SetWebhookRequest = {
	ip_address: string
	max_connections: number
	allowed_updates: string[]
	drop_pending_updates: boolean
	secret_token: string
}

export const telegramCommons = {
	getApiUrl: (botToken: string, methodName: string) => {
		return `https://api.telegram.org/bot${botToken}/${methodName}`
	},
	subscribeWebhook: async (botToken: string, webhookUrl: string, overrides?: Partial<SetWebhookRequest>) => {
		const request: HttpRequest = {
			method: HttpMethod.POST,
			url: `https://api.telegram.org/bot${botToken}/setWebhook`,
			body: {
				allowed_updates: [],
				url: webhookUrl,
				...overrides,
			},
		}

		await httpClient.sendRequest(request)
	},
	unsubscribeWebhook: async (botToken: string) => {
		const request: HttpRequest = {
			method: HttpMethod.GET,
			url: `https://api.telegram.org/bot${botToken}/deleteWebhook`,
		}
		return await httpClient.sendRequest(request)
	},
	/* properties */
	instructions_chat_id: Property.MarkDown({
		displayName: 'Obtaining Chat ID',
		description: chatId,
	}),
	instructions_format: Property.MarkDown({
		displayName: 'Avaible Formats',
		description: formatOptions,
	}),
	chat_id: Property.ShortText({
		displayName: 'Chat Id',
		description: 'The message will be send to this chat ID',
		required: true,
	}),
	message_thread_id: Property.ShortText({
		displayName: 'Message Thread Id',
		description: 'Unique identifier for the target message thread of the forums; for forums supergroups only',
		required: false,
	}),
	format: Property.StaticDropdown({
		displayName: 'Format',
		description: 'Choose format you want ',
		required: false,
		options: {
			options: [
				{
					label: 'Markdown',
					value: 'MarkdownV2',
				},
				{
					label: 'HTML',
					value: 'HTML',
				},
			],
		},
		defaultValue: 'HTML',
	}),
	message: Property.LongText({
		displayName: 'Message',
		description: 'The message to be sent',
		required: true,
	}),
	reply_markup: Property.Json({
		required: false,
		displayName: 'Reply Markup',
		description:
			'Additional Telegram interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. Use special actions such as Build Inline Keyboard to generate this JSON object.',
	}),
}
