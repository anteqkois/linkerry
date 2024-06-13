
import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common';
import { Property, createAction } from '@linkerry/connectors-framework';
import { discordAuth } from '..';
import { discordCommon } from '../common';

export const discordRemoveMemberFromGuild = createAction({
  auth: discordAuth,
  name: 'remove_member_from_guild',
  description: 'Remove a member from a specified guild',
  descriptionLong: 'Eject a member from your Discord guild by specifying their user ID. Useful for moderating and maintaining your community.',
  displayName: 'Remove member from guild',
  props: {
    guild_id: discordCommon.guilds,
    user_id: Property.ShortText({
      displayName: 'User ID',
      description: 'The unique identifier of the member to be removed',
      required: true,
    }),
  },
  async run(configValue) {
    const request: HttpRequest<any> = {
      method: HttpMethod.DELETE,
      url: `https://discord.com/api/v9/guilds/${configValue.propsValue.guild_id}/members/${configValue.propsValue.user_id}`,
      headers: {
        authorization: `Bot ${configValue.auth}`,
        'Content-Type': 'application/json',
      },
    };

    const res = await httpClient.sendRequest<never>(request);

    return {
      success: res.status === 204,
    };
  },
});
