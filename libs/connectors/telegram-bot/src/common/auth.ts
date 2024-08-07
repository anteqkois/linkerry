import { HttpError, HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common'
import { ConnectorAuth } from '@linkerry/connectors-framework'
import { GetMe } from '../types/getMe'
import { telegramCommons } from './common'

const markdownDescription = `**Authentication**:

1. Start a conversation with the [Botfather](https://telegram.me/BotFather).
2. Type in "/newbot"
3. Select a name for your bot.
4. Choose a username for your bot.
5. Copy the token value provided by the Botfather and use it to activate the connection.
6. Congratulations! You can now utilize your new Telegram connection within your flows.
`

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
      if (HttpError.isHttpError(error)) {
        const responseData = error.axiosError.response?.data as {
          ok: boolean
          error_code: number
          description: string
        }
        if (responseData.description?.includes('Not Found')) {
          return {
            valid: false,
            error: 'Invalid Bot Token, bot not found',
          }
        } else {
          console.dir(responseData, { depth: null })
          return {
            valid: false,
            error: responseData.description,
          }
        }
      }

      return {
        valid: false,
        error: error?.message,
      }
    }
  },
})
