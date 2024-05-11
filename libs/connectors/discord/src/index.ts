import { createCustomApiCallAction } from '@linkerry/connectors-common'
import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { discordCreateChannel } from './actions/create-channel'
import { discordDeleteChannel } from './actions/delete-channel'
import { discordSendMessageWebhook } from './actions/send-message-webhook'
import { newMessage } from './triggers/new-message'

const markdown = `To obtain a token, follow these steps:

1. Go to https://discord.com/developers/applications
2. Click on Application (or create one if you don't have one)
3. Click on Bot
4. Copy the token`

export const discordAuth = ConnectorAuth.SecretText({
  displayName: 'Bot Token',
  description: markdown,
  required: true,
})

export const discord = createConnector({
  displayName: 'Discord',
  description: 'Social platform offering instant messaging and VoIP services',
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/discord.png',
  tags: ['communication', 'collaboration', 'community management'],
  auth: discordAuth,
  triggers: [newMessage],
  actions: [
    discordSendMessageWebhook,
    // discordSendApprovalMessage,
    // discordAddRoleToMember,
    // discordRemoveRoleFromMember,
    // discordRemoveMemberFromGuild,
    // discordFindGuildMemberByUsername,
    // discordRenameChannel,
    discordCreateChannel,
    discordDeleteChannel,
    // discordFindChannel,
    // discordRemoveBanFromUser,
    // discordCreateGuildRole,
    // discordDeleteGuildRole,
    // discordBanGuildMember,
    createCustomApiCallAction({
      baseUrl: () => {
        return 'https://discord.com/api/v9'
      },
      authMapping: (auth) => {
        return {
          Authorization: `Bearer ${auth}`,
        }
      },
    }),
  ],
})
