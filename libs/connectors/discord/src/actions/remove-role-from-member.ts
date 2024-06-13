import { HttpRequest, HttpMethod, httpClient } from '@linkerry/connectors-common'
import { createAction, Property } from '@linkerry/connectors-framework'
import { discordAuth } from '..'
import { discordCommon } from '../common'

export const discordRemoveRoleFromMember = createAction({
  auth: discordAuth,
  name: 'remove_role_from_member',
  description: 'Remove a role from a specified guild member',
  descriptionLong:
    'Revoke a specific role from a member in your Discord guild by providing their user ID and the role ID. Useful for role management and updating member permissions.',
  displayName: 'Remove role from member',
  props: {
    guild_id: discordCommon.guilds,
    user_id: Property.ShortText({
      displayName: 'User ID',
      description: 'The unique identifier of the member from whom the role will be removed',
      required: true,
    }),
    role_id: discordCommon.roles,
  },
  async run(configValue) {
    const request: HttpRequest<any> = {
      method: HttpMethod.DELETE,
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
