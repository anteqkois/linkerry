import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common';
import { Property, createAction } from '@linkerry/connectors-framework';
import { discordAuth } from '..';
import { discordCommon } from '../common';

export const discordRenameChannel = createAction({
  auth: discordAuth,
  name: 'rename_channel',
  description: 'Change the name of a specified channel',
  descriptionLong: 'Update the name of a channel in your Discord guild by providing the channel ID and the new name. Useful for rebranding or better channel identification.',
  displayName: 'Rename channel',
  props: {
    channel_id: discordCommon.channel,
    name: Property.ShortText({
      displayName: 'Name',
      description: 'The new desired name for the channel',
      required: true,
    }),
  },
  async run(configValue) {
    const request: HttpRequest<any> = {
      method: HttpMethod.PATCH,
      url: `https://discord.com/api/v9/channels/${configValue.propsValue.channel_id}`,
      body: {
        name: configValue.propsValue.name,
      },
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
