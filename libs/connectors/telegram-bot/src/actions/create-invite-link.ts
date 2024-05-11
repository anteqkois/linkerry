import { HttpMethod, httpClient } from '@linkerry/connectors-common';
import { Property, createAction } from '@linkerry/connectors-framework';
import { telegramBotAuth } from '../common/auth';
import { telegramCommons } from '../common/common';

export const telegramCreateInviteLinkAction = createAction({
  auth: telegramBotAuth,
  name: 'create_invite_link',
  description: 'Create an invite link for a chat',
  displayName: 'Create Invite Link',
  props: {
    instructions_chat_id: telegramCommons.instructions_chat_id,
    chat_id: telegramCommons.chat_id,
    name: Property.ShortText({
      displayName: 'Name',
      description: 'Name of the invite link (max 32 chars)',
      required: false,
    }),
    expire_date: Property.DateTime({
      displayName: 'Expire Date',
      description: 'Time at which the link will no longer be valid',
      required: false,
    }),
    member_limit: Property.Number({
      displayName: 'Member Limit',
      description:
        'The maximum capacity of users able to join and participate in the chat at any given time using this invite link, ranging from 1 to 99999.',
      required: false,
    }),
  },
  async run(ctx) {
    return await httpClient
      .sendRequest<never>({
        method: HttpMethod.POST,
        url: telegramCommons.getApiUrl(ctx.auth, 'createChatInviteLink'),
        headers: {},
        body: {
          chat_id: ctx.propsValue.chat_id,
          name: ctx.propsValue.name ?? undefined,
          expire_date: ctx.propsValue.expire_date
            ? Math.floor(new Date(ctx.propsValue.expire_date).getTime() / 1000)
            : undefined,
          member_limit: ctx.propsValue.member_limit ?? undefined,
        },
      })
      .then((res) => res.body);
  },
});
