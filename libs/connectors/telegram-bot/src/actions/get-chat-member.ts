import { HttpError, HttpMethod, httpClient } from '@linkerry/connectors-common'
import { Property, createAction } from '@linkerry/connectors-framework'
import { telegramCommons } from '../common/common'
import { telegramBotAuth } from '../common/auth'

export const telegramGetChatMemberAction = createAction({
  auth: telegramBotAuth,
  name: 'get_chat_member',
  description: 'Get member info (or null) for provided chat id and user id',
  displayName: 'Get Chat Member',
  props: {
    instructions_chat_id: telegramCommons.instructions_chat_id,
    chat_id: telegramCommons.chat_id,
    user_id: Property.ShortText({
      displayName: 'User Id',
      description: 'A unique identifier of Telegram user',
      required: true,
    }),
  },
  async run(ctx) {
    try {
      return await httpClient
        .sendRequest<never>({
          method: HttpMethod.POST,
          url: telegramCommons.getApiUrl(ctx.auth, 'getChatMember'),
          headers: {},
          body: {
            chat_id: ctx.propsValue.chat_id,
            user_id: ctx.propsValue.user_id,
          },
        })
        .then((res) => res.body)
    } catch (error) {
      return (error as HttpError).errorMessage().response.body
    }
  },
})
