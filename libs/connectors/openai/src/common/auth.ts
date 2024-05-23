import { AuthenticationType, HttpMethod, httpClient } from '@linkerry/connectors-common'
import { ConnectorAuth } from '@linkerry/connectors-framework'
import { baseUrl } from './common'

const markdownDescription = `
To obtain your OpenAI API Key:

1. Go to the OpenAI website **[OpenAI website](https://platform.openai.com/account/api-keys)**.
2. When you're on the website, find and select the option to get your OpenAI API Key..

It's highly advised to input your credit card details into your OpenAI account and switch to the paid subscription plan before generating the API Key. Doing it can helpt to avoid 429 code error.
`

export const openaiAuth = ConnectorAuth.SecretText({
  description: markdownDescription,
  displayName: 'API Key',
  required: true,
  validate: async (auth) => {
    try {
      await httpClient.sendRequest<{
        data: { id: string }[]
      }>({
        url: `${baseUrl}/models`,
        method: HttpMethod.GET,
        authentication: {
          type: AuthenticationType.BEARER_TOKEN,
          token: auth.auth as string,
        },
      })
      return {
        valid: true,
      }
    } catch (e) {
      return {
        valid: false,
        error: 'Invalid API key',
      }
    }
  },
})
