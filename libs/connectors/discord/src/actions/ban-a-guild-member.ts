import { HttpRequest, HttpMethod, httpClient } from '@linkerry/connectors-common';
import { createAction, Property } from '@linkerry/connectors-framework';
import { discordAuth } from '..';
import { discordCommon } from '../common';

export const discordBanGuildMember = createAction({
  auth: discordAuth,
  name: 'ban_guild_member',
  description: 'Ban a member from your Discord server',
  descriptionLong: 'Ban a disruptive or uncooperative member from your Discord server. Optionally specify a reason for the ban.',
  displayName: 'Ban guild member',
  props: {
    guild_id: discordCommon.guilds,
    user_id: Property.ShortText({
      displayName: 'User ID',
      description: 'The unique identifier of the member to be banned',
      required: true,
    }),
    ban_reason: Property.ShortText({
      displayName: 'Ban Reason',
      description: 'The reason for banning the member, which can be viewed in audit logs',
      required: false,
    }),
  },
  async run(configValue) {
    const request: HttpRequest<any> = {
      method: HttpMethod.PUT,
      url: `https://discord.com/api/v9/guilds/${configValue.propsValue.guild_id}/bans/${configValue.propsValue.user_id}`,
      headers: {
        authorization: `Bot ${configValue.auth}`,
        'Content-Type': 'application/json',
        'X-Audit-Log-Reason': `${configValue.propsValue.ban_reason}`,
      },
      body: {
        reason: `${configValue.propsValue.ban_reason}`,
      },
    };

    const res = await httpClient.sendRequest<never>(request);

    return {
      success: res.status === 204,
    };
  },
});
