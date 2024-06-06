import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common'
import { Property, createAction } from '@linkerry/connectors-framework'
import { discordAuth } from '..'
import { discordCommon } from '../common'

export const discordCreateChannel = createAction({
  auth: discordAuth,
  name: 'create_channel',
  description: 'Create a channel',
  displayName: 'Create channel',
  props: {
    guild_id: discordCommon.guilds,
    name: Property.ShortText({
      displayName: 'Name',
      description: 'The name of the new channel',
      required: true,
    }),
  },

  async run(configValue) {
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: `https://discord.com/api/v9/guilds/${configValue.propsValue.guild_id}/channels`,
      body: {
        name: configValue.propsValue.name,
      },
      headers: {
        authorization: `Bot ${configValue.auth}`,
        'Content-Type': 'application/json',
      },
    }

    const res = await httpClient.sendRequest(request)

    return {
      success: res.status === 201,
      channel: {
        id: res.body['id'],
        name: res.body['name'],
      },
    }
  },
})
