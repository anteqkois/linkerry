import { createCustomApiCallAction } from '@linkerry/connectors-common';
import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework';
import { discordCreateChannel } from './actions/create-channel';
import { discordDeleteChannel } from './actions/delete-channel';
import { discordSendMessageWebhook } from './actions/send-message-webhook';
import { newMessage } from './triggers/new-message';

const markdown = `
To obtain a token, follow these steps:

1. Go to https://discord.com/developers/applications
2. Click on Application (or create one if you don't have one)
3. Click on Bot
4. Copy the token
`;

export const discordAuth = ConnectorAuth.SecretText({
  displayName: 'Bot Token',
  description: markdown,
  required: true,
});

export const discord = createConnector({
  displayName: 'Discord',
  description: 'Social platform offering instant messaging and VoIP services',
  minimumSupportedRelease: '0.0.0',
  logoUrl: 'https://lh3.googleusercontent.com/fife/ALs6j_EYlVbCph6one44xP2dSwa3k8XlgQBpc4F11bZeKK7nrqTP5Scwvgcx3tpAtgXN14yxTAMVx5aq8_h_FnrFKcwaP5kmjdQwCQLlgBIrZWbsz00vuV0NsWwH4nD6AcgfZtujylIx112xXojKyvsQYUZzJUKRXlzcY6moOkNpHxqjZDDBYDnmFDax82vKnF2pu4jg5hqAqQujxtCjW6PfqCLuAxAnyWfbGaIhZcOC2ZfmyJIhxodkFw9qMe2j1EnwNk_wY_yjoIyPXnBPAO_A5fBCzNNoUm3Tw0_5DO0QdghdlXxzYJvDz0vc-KKVeKXo_pCHdMw9I_RlAaz6DOvJaOk1nFSJ6haCcTuqjRxQAM3ITjqjLl4_It1oDfpk1Q4Rhz1OU5ifl8wDBTfthzrlsV05Gza6rda6qyc9lau_Fm4KWCU-KqBLUd4oueY1sVrjub4sm2exMxZlul7vHdi02oNFYvES3hNwe8Km5Ts7tnZw4NIGy51qMkgb24pNgg_IowrYgQ_E9Zbz6yfubHpP5UWACgqFJMbw8vTGFnuQtl1VkLAaJrfa8_1oIM7eAPVZB9hyy0rVN59wAcVKbJA1vDPENazP--0dhjFljk-DvwXaYmSGajynxuLRK9BVMEzrD4Nv6t06Mr5x-D6BdmG3ULR2jZnmENoybG6I4G0tmMmELm0uPylOTWxBuzQTH6F8gG4lUf76OWrE_6-cCrrbiPIYllgqW58Ym4NQh1cL-OtAi9mCUAHvgisZR_RIkR0t6PrAO7xDV584mUvxfxgSoXV0oSDnhtTVle44ke5cCwpdIB1AHxdCLqFS2DqwheJXA99eMuPsYPusZP6r7RQQVd3jQnuJe7nGzxxbSfTmc7DTUJc-fSeAGRsdHj51XBpqxCBdjb4yYuyf8JJqon1_MRrs3GKck4jNJ4oCHdLMtisLJbg89apRrJB_UsM-hAYYF7C9jwsCwmWuKFW5CMpErEF5hebGv84WnWgANPihkSvwL1cX_byARwUHJ2eiRo_UAk3ZjSmh8dv-aJkchEU0EUPUxTvasYHhzorboR8RP_J0hCMa12mRheMhnrNiw9PKdSGD4ZgfdcRgpys2jttovtaJLbj0ef7-nvs-CE-fITwD-2kc6ls5zk0uCP-zMj-hRANAw8rewhRVHj4r19RyQ7fjIGgJq9oSuDdKOJ2hOXJ4rpLW0UX-N4CSCCI5vlig4ZNOT1YDxdhUpLMZrlf65K3Gud1uZyrE07rCZlO5csERtufOXQlCMBQL22kNiozBFmX2NAu9gLSYo5Z0PEQGQCKScyfZrXB-003RvnugrzmtzNDY_7Rdxtpi0GQpF93kuBGt9eqdCFcVVOL56t9uLaA7SjEn0eksM-UAw7-VAebGZQVp_JrDGlyWtTJUXDO-drt5t8rn6qrgsJbEs1NEVjqRXn6llHLtQwWmnYV4QTfwbyfi9X177eVAU9ap3OpwyG-ikelYn2WvAYnUmS1JeCHBMhNOIdcxlujWrDDFfvjQxTEDgBOzD5epuptSPtZINRMnY2qNvr5p-SqAPV6-zW85Xvt0QUk0CQ9mqitN65hYpPaFuaYplcu2XQVXAE3iir1T5SGHfWIjI9sT41vXPjGbJrrKx-hXDd7yREzUJo5zX9N5P5nk6aQXK1YH4dimPHp0jx1oCXuCLSsWJyOJTawZhzmIprOYNMraMUSBkim6YA-9a-_rMvCr4Ue2-JW-IVRLaPsU3Fpvex66vDEh5gOG-7ZcQc5A8uLjFQeKYnvZSfcr6mKU0KMlf3dODbpveQ=w1806-h1558',
	tags: ['communication', 'collaboration', 'community management'],
  auth: discordAuth,
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
        return 'https://discord.com/api/v9';
      },
      authMapping: (auth) => {
        return {
          Authorization: `Bearer ${auth}`,
        };
      },
    }),
  ],
  triggers: [newMessage],
});
