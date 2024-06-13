
import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common';
import { Property, createAction } from '@linkerry/connectors-framework';
import { discordAuth } from '..';
import { discordCommon } from '../common';
import { Channel } from '../common/models';

export const discordFindChannel = createAction({
  auth: discordAuth,
  name: 'find_channel',
  description: 'Find a specific channel in a guild by name',
  descriptionLong: 'Locate a specific channel in your Discord guild by its name. Useful for quickly accessing or managing channels.',
  displayName: 'Find channel',
  props: {
    guild_id: discordCommon.guilds,
    name: Property.ShortText({
      displayName: 'Name',
      description: 'The name of the channel',
      required: true,
    }),
  },
  async run(configValue) {
    const request: HttpRequest<any> = {
      method: HttpMethod.GET,
      url: `https://discord.com/api/v9/guilds/${configValue.propsValue.guild_id}/channels`,
      headers: {
        authorization: `Bot ${configValue.auth}`,
        'Content-Type': 'application/json',
      },
    };

    const res = await httpClient.sendRequest<Channel[]>(request);

    const channel = res.body.find(
      (channel) => channel.name === configValue.propsValue.name
    );

    return {
      success: res.status === 200 && !!channel,
      channel_id: channel?.id,
    };
  },
});
