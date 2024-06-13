import { HttpMethod, HttpRequest, httpClient } from "@linkerry/connectors-common";
import { Property, createAction } from "@linkerry/connectors-framework";
import { discordAuth } from "..";
import { discordCommon } from "../common";

export const discordDeleteGuildRole = createAction({
  auth: discordAuth,
  name: 'deleteGuildRole',
  description: 'Delete a specific role in a guild',
  descriptionLong: 'Remove an existing role from your Discord guild. Ideal for cleaning up unnecessary or outdated roles.',
  displayName: 'Delete guild role',
  props: {
    guild_id: discordCommon.guilds,
    role_id: discordCommon.roles,
    deletion_reason: Property.ShortText({
      displayName: 'Deletion reason',
      description: 'The reason for deleting the role',
      required: false,
    }),
  },
  async run(configValue) {
    const request: HttpRequest = {
      url: `https://discord.com/api/v9/guilds/${configValue.propsValue.guild_id}/roles/${configValue.propsValue.role_id}`,
      method: HttpMethod.DELETE,
      headers: {
        Authorization: `Bot ${configValue.auth}`,
        'Content-Type': 'application/json',
        'X-Audit-Log-Reason': `${configValue.propsValue.deletion_reason}`,
      },
    };

    const res = await httpClient.sendRequest(request);

    return {
      success: res.status === 204,
    };
  },
});
