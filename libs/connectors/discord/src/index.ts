import { createCustomApiCallAction } from '@linkerry/connectors-common'
import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { discordAddRoleToMember } from './actions/add-role-to-member'
import { discordBanGuildMember } from './actions/ban-a-guild-member'
import { discordCreateChannel } from './actions/create-channel'
import { discordCreateGuildRole } from './actions/create-guild-role'
import { discordDeleteChannel } from './actions/delete-channel'
import { discordDeleteGuildRole } from './actions/delete-guild-role'
import { discordFindChannel } from './actions/find-channel'
import { discordFindGuildMemberByUsername } from './actions/find-guild-member'
import { discordRemoveBanFromUser } from './actions/remove-ban-from-user'
import { discordRemoveMemberFromGuild } from './actions/remove-member-from-guild'
import { discordRemoveRoleFromMember } from './actions/remove-role-from-member'
import { discordRenameChannel } from './actions/rename-channel'
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
  description: 'A communication platform for voice, video, and text chat.',
  descriptionLong:
    'Discord is a versatile communication app that allows users to connect through voice, video, and text chat. It is perfect for both personal and professional use. With Discord, users can easily communicate with friends, family, or colleagues through reliable and secure voice calls, video conferences, and real-time messaging. The app also provides various features to enhance communication, such as private messaging, group chats, and the ability to share files and media. Additionally, users can join or create communities called servers, where they can connect with like-minded individuals who share similar interests, hobbies, or professions. With its user-friendly interface and extensive functionality, Discord is a one-stop solution for those seeking efficient and automated communication in their daily tasks.',
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/discord.png',
  tags: ['communication', 'collaboration', 'community management'],
  auth: discordAuth,
  triggers: [newMessage],
  actions: [
    discordSendMessageWebhook,
    // discordSendApprovalMessage,
    discordAddRoleToMember,
    discordRemoveRoleFromMember,
    discordRemoveMemberFromGuild,
    discordFindGuildMemberByUsername,
    discordRenameChannel,
    discordCreateChannel,
    discordDeleteChannel,
    discordFindChannel,
    discordRemoveBanFromUser,
    discordCreateGuildRole,
    discordDeleteGuildRole,
    discordBanGuildMember,
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
