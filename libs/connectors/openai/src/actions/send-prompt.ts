import { Property, StoreScope, Validators, createAction } from '@linkerry/connectors-framework'
import OpenAI from 'openai'
import { openaiAuth } from '../common/auth'
import { calculateMessagesTokenSize, exceedsHistoryLimit, notLLMs, reduceContextSize } from '../common/common'

export const askOpenAI = createAction({
  auth: openaiAuth,
  name: 'ask_chatgpt',
  displayName: 'Ask ChatGPT',
  description: 'Ask ChatGPT anything you want!',
  props: {
    model: Property.DynamicDropdown({
      displayName: 'Model',
      required: true,
      description:
        'The model that will generate the completion. Certain models are skilled natural in language tasks, while others specialize in coding.',
      refreshers: [],
      defaultValue: 'gpt-3.5-turbo',
      options: async ({ auth }) => {
        if (!auth) {
          return {
            disabled: true,
            placeholder: 'Enter your API key first',
            options: [],
          }
        }
        try {
          const openai = new OpenAI({
            apiKey: auth as string,
          })
          const response = await openai.models.list()
          // We need to get only LLM models
          const models = response.data.filter((model) => !notLLMs.includes(model.id))
          return {
            disabled: false,
            options: models.map((model) => {
              return {
                label: model.id,
                value: model.id,
              }
            }),
          }
        } catch (error) {
          return {
            disabled: true,
            options: [],
            placeholder: "Couldn't load models, API key is invalid",
          }
        }
      },
    }),
    prompt: Property.LongText({
      displayName: 'Question',
      required: true,
    }),
    temperature: Property.Number({
      displayName: 'Temperature',
      required: false,
      description:
        'Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.',
      validators: [Validators.minValue(0), Validators.maxValue(1.0)],
      defaultValue: 0.9,
    }),
    maxTokens: Property.Number({
      displayName: 'Maximum Tokens',
      required: true,
      description:
        'The maximum number of tokens to generate should not be set to the absolute maximum. Reserve some tokens for the input, as requests can utilize up to 2,048 or 4,096 tokens shared between the prompt and completion, depending on the model. (One token is approximately 4 characters for regular English text)',
      defaultValue: 2048,
    }),
    topP: Property.Number({
      displayName: 'Top P',
      required: false,
      description:
        'An option to sampling with temperature is nucleus sampling, where the model takes into account the tokens with top_p probability mass. For example, with a value of 0.1, only the tokens constituting the top 10% probability mass are considered.',
      defaultValue: 1,
    }),
    frequencyPenalty: Property.Number({
      displayName: 'Frequency penalty',
      required: false,
      description:
        "A number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.",
      defaultValue: 0,
    }),
    presencePenalty: Property.Number({
      displayName: 'Presence penalty',
      required: false,
      description:
        "A number between -2.0 and 2.0. Positive values penalize new tokens based on their appearance in the text so far, increasing the model's likelihood to discuss new topics.",
      defaultValue: 0.6,
    }),
    memoryKey: Property.ShortText({
      displayName: 'Memory Key',
      validators: [Validators.maxLength(128)],
      description:
        "A memory key that will keep the chat history shared across runs and flows. Leave it empty to reset ChatGPT's memory of previous messages.",
      required: false,
    }),
    roles: Property.Json({
      displayName: 'Roles',
      required: false,
      description: 'Array of roles to specify more accurate response',
      defaultValue: [{ role: 'system', content: 'You are a helpful assistant.' }],
    }),
  },
  async run({ auth, propsValue, store }) {
    const openai = new OpenAI({
      apiKey: auth,
    })
    const { model, temperature, maxTokens, topP, frequencyPenalty, presencePenalty, prompt, memoryKey } = propsValue

    let messageHistory: any[] | null = []
    // If memory key is set, retrieve messages stored in history
    if (memoryKey) {
      messageHistory = (await store.get(memoryKey, StoreScope.PROJECT)) ?? []
    }

    // Add user prompt to message history
    messageHistory.push({
      role: 'user',
      content: prompt,
    })

    // Add system instructions if set by user
    const rolesArray = propsValue.roles ? (propsValue.roles as any) : []
    console.log('rolesArray', rolesArray)
    console.log(typeof rolesArray)
    const roles = rolesArray.map((item: any) => {
      const rolesEnum = ['system', 'user', 'assistant']
      if (!rolesEnum.includes(item.role)) {
        throw new Error('The only available roles are: [system, user, assistant]')
      }

      return {
        role: item.role,
        content: item.content,
      }
    })

    // Send prompt
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [...roles, ...messageHistory],
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: topP,
      frequency_penalty: frequencyPenalty,
      presence_penalty: presencePenalty,
    })

    // Add response to message history
    messageHistory = [...messageHistory, completion.choices[0].message]

    // Check message history token size
    // System limit is 32K tokens, we can probably make it bigger but this is a safe spot
    const tokenLength = await calculateMessagesTokenSize(messageHistory, model)
    if (memoryKey) {
      // If tokens exceed 90% system limit or 90% of model limit - maxTokens, reduce history token size
      if (exceedsHistoryLimit(tokenLength, model, maxTokens)) {
        messageHistory = await reduceContextSize(messageHistory, model, maxTokens)
      }
      // Store history
      await store.put(memoryKey, messageHistory, StoreScope.PROJECT)
    }

    return completion.choices[0].message.content
  },
})
