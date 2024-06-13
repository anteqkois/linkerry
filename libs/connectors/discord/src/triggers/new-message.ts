import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common'
import { DedupeStrategy, Polling, Property, createTrigger, pollingHelper } from '@linkerry/connectors-framework'
import { CustomError, ErrorCodeConnectors, TriggerStrategy } from '@linkerry/shared'
import dayjs from 'dayjs'
import { discordAuth } from '..'
import { discordCommon } from '../common'
import { Message } from '../common/models'

const polling: Polling<string, { channel: string | undefined; limit: number }> = {
  strategy: DedupeStrategy.TIMEBASED,
  items: async ({ auth, propsValue: { channel, limit } }) => {
    if (channel === undefined) return []

    const request: HttpRequest = {
      method: HttpMethod.GET,
      url: 'https://discord.com/api/v9/channels/' + channel + '/messages?limit=' + limit,
      headers: {
        Authorization: 'Bot ' + auth,
      },
    }

    const res = await httpClient.sendRequest<Message[]>(request)

    const items = res.body
    return items.map((item) => ({
      epochMilliSeconds: dayjs(item.timestamp).valueOf(),
      data: item,
    }))
  },
}

export const newMessage = createTrigger({
  auth: discordAuth,
  name: 'new_message',
  displayName: 'New message',
  description: 'Triggers when a message is sent in a channel',
  type: TriggerStrategy.POLLING,
  props: {
    limit: Property.Number({
      displayName: 'Limit',
      description: 'The number of messages to fetch',
      required: false,
      defaultValue: 50,
    }),
    channel: discordCommon.channel,
  },
  sampleData: {},
  onEnable: async (context) => {
    await pollingHelper.onEnable(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: {
        channel: context.propsValue.channel,
        limit: context.propsValue.limit ?? 50,
      },
    })
  },
  onDisable: async (context) => {
    await pollingHelper.onDisable(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: {
        channel: context.propsValue.channel,
        limit: context.propsValue.limit ?? 50,
      },
    })
  },
  run: async (context) => {
    return await pollingHelper.poll(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: {
        channel: context.propsValue.channel,
        limit: context.propsValue.limit ?? 50,
      },
    })
  },
  test: async (context) => {
    const items = await pollingHelper.test(polling, {
      auth: context.auth,
      store: context.store,
      propsValue: {
        channel: context.propsValue.channel,
        limit: context.propsValue.limit ?? 50,
      },
    })

    if (!items.length)
      throw new CustomError('Missing channel data', ErrorCodeConnectors.FAILED_TEST, {
        userMessage: 'Can not retrive any messages from this channel. Make sure the channel has messages and is not empty',
      })

    return items
  },
})
