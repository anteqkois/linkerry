import { HttpMethod, httpClient } from '@linkerry/connectors-common'
import { createAction } from '@linkerry/connectors-framework'
import { telegramBotAuth } from '..'
import { telegramCommons } from '../common'

export const telegramSendMessageAction = createAction({
	auth: telegramBotAuth,
	name: 'send_text_message',
	description: 'Send a message through a Telegram bot',
	displayName: 'Send Text Message',
	props: {
		instructions_chat_id: telegramCommons.instructions_chat_id,
		chat_id: telegramCommons.chat_id,
		instructions_format: telegramCommons.instructions_format,
		message: telegramCommons.message,
		message_thread_id: telegramCommons.message_thread_id,
		format: telegramCommons.format,
		reply_markup:telegramCommons.reply_markup,
	},
	async run(ctx) {
		return await httpClient.sendRequest<never>({
			method: HttpMethod.POST,
			url: telegramCommons.getApiUrl(ctx.auth, 'sendMessage'),
			body: {
				chat_id: ctx.propsValue['chat_id'],
				text: ctx.propsValue['message'],
				message_thread_id: ctx.propsValue['message_thread_id'] ?? undefined,
				parse_mode: ctx.propsValue['format'] ?? 'MarkdownV2',
				reply_markup: ctx.propsValue['reply_markup'] ?? undefined,
			},
		})
	},
})
