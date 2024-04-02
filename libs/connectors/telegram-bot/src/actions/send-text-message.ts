import { HttpMethod, httpClient } from '@linkerry/connectors-common'
import { Property, createAction } from '@linkerry/connectors-framework'
import { telegramBotAuth } from '..'
import { telegramCommons } from '../common'

const chatId = `

1. Start a conversation with the [Get My ID](https://telegram.me/getmyid_bot).
2. Type and send the command "/my_id" to the bot.
3. The bot will respond to you and and among other information they will be your chat ID.

**Note: Ensure you initiate the chat with the bot to avoid receiving an error for "chat not found."**
`
const format = `
[Link example](https://core.telegram.org/bots/api#formatting-options)
`
export const telegramSendMessageAction = createAction({
	auth: telegramBotAuth,
	name: 'send_text_message',
	description: 'Send a message through a Telegram bot',
	displayName: 'Send Text Message',
	props: {
		instructions: Property.MarkDown({
			displayName: 'Obtaining Chat ID',
			description: chatId,
		}),
		chat_id: Property.ShortText({
			displayName: 'Chat Id',
			description:'The message will be send to this chat ID',
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
			defaultValue: 'MarkdownV2',
		}),
		instructions_format: Property.MarkDown({
			displayName: 'Avaible Formats',
			description: format,
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
				'Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. Use special actions such as Build Inline Keyboard to generate this JSON object.',
		}),
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
