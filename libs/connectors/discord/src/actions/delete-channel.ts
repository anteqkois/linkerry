import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common'
import { createAction } from '@linkerry/connectors-framework'
import { discordAuth } from '..'
import { discordCommon } from '../common'

export const discordDeleteChannel = createAction({
  auth: discordAuth,
  name: 'delete_channel',
  description: 'Delete an existing Discord channel',
  descriptionLong: 'Remove an existing text or voice channel from your Discord server. Useful for decluttering or reorganizing.',
  displayName: 'Delete channel',
  props: {
    channel_id: discordCommon.channel,
  },
  async run(configValue) {
    const request: HttpRequest = {
      method: HttpMethod.DELETE,
      url: `https://discord.com/api/v9/channels/${configValue.propsValue.channel_id}`,
      headers: {
        authorization: `Bot ${configValue.auth}`,
        'Content-Type': 'application/json',
      },
    }

    const res = await httpClient.sendRequest<never>(request)

    return res.body
  },
})
