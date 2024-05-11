import { AuthenticationType, HttpMethod, createCustomApiCallAction, httpClient } from '@linkerry/connectors-common'
import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { askAssistant } from './actions/ask-assistant'
import { extractStructuredDataAction } from './actions/extract-structure-data.action'
import { generateImage } from './actions/generate-image'
import { askOpenAI } from './actions/send-prompt'
import { textToSpeech } from './actions/text-to-speech'
// import { transcribeAction } from './actions/transcriptions'
// import { translateAction } from './actions/translation'
// import { visionPrompt } from './actions/vision-prompt'
import { baseUrl } from './common/common'

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

export const openai = createConnector({
  displayName: 'OpenAI',
  description: 'Take advantage of the many tools ChatGPT has to offer. Use artificial intelligence to speed up your business and save time.',
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/openai.png',
  tags: ['artificial intelligence'],
  auth: openaiAuth,
  actions: [
    askOpenAI,
    askAssistant,
    generateImage,
    // visionPrompt,
    textToSpeech,
    // transcribeAction,
    // translateAction,
    extractStructuredDataAction,
    createCustomApiCallAction({
      auth: openaiAuth,
      baseUrl: () => baseUrl,
      authMapping: (auth) => {
        return {
          Authorization: `Bearer ${auth}`,
        }
      },
    }),
  ],
  triggers: [],
})
