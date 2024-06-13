import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common'
import { Property, createAction } from '@linkerry/connectors-framework'
import { discordAuth } from '..'
import { discordCommon } from '../common'

export const discordAddRoleToMember = createAction({
  auth: discordAuth,
  name: 'add_role_to_member',
  description: 'Assign roles to members easily',
  descriptionLong:
    'Use this feature to assign roles to guild members in your Discord server. Ideal for managing permissions and organizing member responsibilities efficiently.',
  displayName: 'Add role to member',
  props: {
    guild_id: discordCommon.guilds,
    user_id: Property.ShortText({
      displayName: 'User ID',
      description: 'The user ID of the member to whom the role will be assigned.',
      required: true,
    }),
    role_id: discordCommon.roles,
  },
  async run(configValue) {
    const request: HttpRequest<any> = {
      method: HttpMethod.PUT,
      url: `https://discord.com/api/v9/guilds/${configValue.propsValue.guild_id}/members/${configValue.propsValue.user_id}/roles/${configValue.propsValue.role_id}`,
      headers: {
        authorization: `Bot ${configValue.auth}`,
        'Content-Type': 'application/json',
      },
    }

    const res = await httpClient.sendRequest<never>(request)

    return {
      success: res.status === 204,
    }
  },
})
