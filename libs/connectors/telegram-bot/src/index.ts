import { ConnectorAuth, createConnector } from '@linkerry/connectors-framework'
import { telegramSendMessageAction } from './actions/send-text-message'
import { telegramNewMessage } from './triggers/new-message'

const markdownDescription = `
**Authentication**:

1. Start a conversation with the [Botfather](https://telegram.me/BotFather).
2. Type in "/newbot"
3. Select a name for your bot.
4. Choose a username for your bot.
5. Copy the token value provided by the Botfather and use it to activate the connection.
6. Congratulations! You can now utilize your new Telegram connection within your flows.
`

export const telegramBotAuth = ConnectorAuth.SecretText({
	displayName: 'Bot Token',
	description: markdownDescription,
	required: true,
})

export const telegramBot = createConnector({
	displayName: 'Telegram Bot',
	description: 'Build chatbots for Telegram',
	minimumSupportedRelease: '0.0.0',
	logoUrl:
		'https://lh3.googleusercontent.com/fife/ALs6j_E8Fx9SCS-6sQBftIHXooiiBRB3XIoz6VKygDpyCX2tEqWUlDi0j4zjdYsu9L-b-oacGNAC7kKE0435dqBALEX8NdyhpB9buintRst3Z4KZAS_SfQrrM_QT-JyrnbuEGEmlAYHeyvnjCWVv1s3v3Ho24Vuaw7ngaC2_zYuAMEj4cZ9wfH0C_qCdPgUCvGAbsmzaBJWqZh50CHVeiwNExivd9gy4MVdCAq4KwTV3Cz000K4u38WchUVLe5GL1pRDA1JCahN05MV3gRnH-0H8hTJeJysKRfgR51XBAdOC2S-uEikji5pglRVHBk9RBSjz65kTPmfiWrCDi-M-blpDl9kPa078ZxXRlXtLzXOHwqZwqBpVMZjPuCOk3rY2SmcDYp51C0gzjlyAt38txPGXpfhy5mHlpre19IJgC8U_tWBncZKLkPPhxv5vQqn0AAKRDrYpWh0mMprQnVndvW9Iw_ZgN-Lt5CGUmP5jkIlaTw5CNToEsBgIA4aoKg-770LW7QdgdxtbfL7bjrIGkjY_9IQGEiW1ADu5E0RQrHCRoISE93dLwqJGIfS-S8Xp_DHf3ik08mn6Lilr81N33zkciwb7WLm3-BvYCFgPVt6RdFUQ0mcft_96-Yb66b2kuf5RGs4g0MVYmmKdlLec-t-11MPMMp_saENdphu16s0IPTfZn6OuLXnnFLfc5jl3H69bthOr6QeGikBYnhgwXZs8Hwh16sAXCSG0vludDGjGeou_KfpPLPVJez_jNmaAqVHtdXxoQceRV9snwlHmb4ch18b5cgsYTbxUnVfheyhu3P_xFJPS7hK-uYPULZIeXrFeu2tURc-hC8l5vlK6QCFDNx9RL7G1nPEA-rudTL_cV8z58dFoSSGwYlxe6spqumAYPHXLE-ZZ91Ht7iGR3jMF-fRbDxQvLlYrDsX-iEU29qYTBva6ViAoCR5owA5IYV1aUHLuZ3Al71ZCYknNKXirwV1s53PVwmXLywwUIxWQJBfOT_u8oR-EfUuIQOmvex4f6xedz64uDRa5If5Sx--k74qjQcgMjqXva7HbILSUILxuQ6mwdCMPHMRmso2OXVfBoe1n6Ua4VKYSgzxncnY-QAx_h43FosS4t8YR5REEGcWulvOsWGOGxfgP_mkAKxVZiFJKQuGbzI_aJsrmG5soKf8qE-EEzCoyM_m6pDDpeAIPuRORy_gludL2g5FjrWZpPs7ZRa3xsq7-1oxLWgrHaFXUMPzUAmB_s7K3Kh7MD8C9G9UoxDGYy3SZPIeYP3ByrNbDTan8mi0ie9CEEHHHGQmrc6mCvj73eOD02q1uUziL8PG_EtuxEI-S--gCszuqRvWgMtQUe5YK7UKmua-PKk-e3B5wqvU2yHNvqzuWeGLHC5MdDSk78F61xKul7Mus_Fz2jGO1xLo8tUWwJ_UikYZPwB8AERI90oepLQs3bwX9pGVkImidhavbBttciO0BlzU83ILKnFIffM4ybXxEbsOLhiGo9F6exc2KOSJW9XdLaE3TtfWmqWNXtaNdM2756DCYjMSAfh13mV4pCB-guO9ptVYmoDHJW7n-e4aCDP_oeZN4r9qA5VkcMnJ0iwPvWcUG-QW_tWTuvR25Ih9ol3XKWhfsUcVSn58bP8s8k761bAo7Dd4YUKK_J7ySIH3MF6ip0uW9XpEdPnhtP4TReGNRqHyM2TNmg0y-OSiP0zj8vExr7-3Jip8a66rwa-YCbIVdfvT7DR7rFc-vDSukEznjNPF3tJJh3uD0HRTKU42RHWdwmayEpRP80Oid_iD7Mw=w1890-h1554',
	tags: ['communication', 'bots', 'cryptocurrency'],
	auth: telegramBotAuth,
	actions: [
		telegramSendMessageAction
		// telegramSendMediaAction,
		// telegramGetChatMemberAction,
		// telegramCreateInviteLinkAction,
		// createCustomApiCallAction({
		// 	baseUrl: (auth) => telegramCommons.getApiUrl(auth as string, ''),
		// 	auth: telegramBotAuth,
		// }),
	],
	triggers: [telegramNewMessage],
})
