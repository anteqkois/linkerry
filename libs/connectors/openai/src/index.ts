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
import { openaiAuth } from './common/auth'

export const openai = createConnector({
  displayName: 'OpenAI',
  description: 'Take advantage of the many tools ChatGPT has to offer. Use artificial intelligence to speed up your business and save time.',
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/openai.png',
  tags: ['ai'],
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
