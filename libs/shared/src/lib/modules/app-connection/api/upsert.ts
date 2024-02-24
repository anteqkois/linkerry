import { AppConnectionType } from '../app-connection'

interface CommonAuthProps {
	name: string
	connectorName: string
}

export enum OAuth2GrantType {
	AUTHORIZATION_CODE = 'authorization_code',
	CLIENT_CREDENTIALS = 'client_credentials',
}

export interface UpsertCustomAuthInput extends CommonAuthProps {
	type: AppConnectionType.CUSTOM_AUTH
	value: {
		type: AppConnectionType.CUSTOM_AUTH
		props: Record<string, unknown>
	}
}

// export const UpsertPlatformOAuth2Request = Type.Object({
//     ...commonAuthProps,
//     type: Type.Literal(AppConnectionType.PLATFORM_OAUTH2),
//     value: Type.Object({
//         client_id: Type.String(),
//         authorization_method: Type.Optional(Type.Enum(OAuth2AuthorizationMethod)),
//         code: Type.String(),
//         code_challenge: Type.Optional(Type.String()),
//         props: Type.Optional(Type.Record(Type.String(), Type.String())),
//         scope: Type.String(),
//         type: Type.Literal(AppConnectionType.PLATFORM_OAUTH2),
//         token_url: Type.Optional(Type.String({})),
//         redirect_url: Type.String({}),
//     }),
// }, {
//     title: 'Platform OAuth2',
//     description: 'Platform OAuth2',
// })

// export const UpsertCloudOAuth2Request = Type.Object({
//     ...commonAuthProps,
//     type: Type.Literal(AppConnectionType.CLOUD_OAUTH2),
//     value: Type.Object({
//         client_id: Type.String(),
//         authorization_method: Type.Optional(Type.Enum(OAuth2AuthorizationMethod)),
//         code: Type.String(),
//         code_challenge: Type.Optional(Type.String()),
//         props: Type.Optional(Type.Record(Type.String(), Type.String())),
//         scope: Type.String(),
//         type: Type.Literal(AppConnectionType.CLOUD_OAUTH2),
//         token_url: Type.Optional(Type.String({})),
//     }),
// }, {
//     title: 'Cloud OAuth2',
//     description: 'Cloud OAuth2',
// })

export interface UpsertSecretTextInput extends CommonAuthProps {
	type: AppConnectionType.SECRET_TEXT
	value: {
		type: AppConnectionType.CUSTOM_AUTH
		secret_text: string
	}
}

// export const UpsertOAuth2Request = Type.Object({
//     ...commonAuthProps,
//     type: Type.Literal(AppConnectionType.OAUTH2),
//     value: Type.Object({
//         client_id: Type.String({}),
//         client_secret: Type.String({}),
//         grant_type: Type.Optional(Type.Enum(OAuth2GrantType)),
//         token_url: Type.String({}),
//         props: Type.Optional(Type.Record(Type.String(), Type.Any())),
//         scope: Type.String(),
//         code: Type.String(),
//         authorization_method: Type.Optional(Type.Enum(OAuth2AuthorizationMethod)),
//         code_challenge: Type.Optional(Type.String()),
//         redirect_url: Type.String({}),
//         type: Type.Literal(AppConnectionType.OAUTH2),
//     }),
// }, {
//     title: 'OAuth2',
//     description: 'OAuth2',
// })

// export const UpsertBasicAuthRequest = Type.Object({
//     ...commonAuthProps,
//     type: Type.Literal(AppConnectionType.BASIC_AUTH),
//     value: Type.Object({
//         username: Type.String({}),
//         password: Type.String({}),
//         type: Type.Literal(AppConnectionType.BASIC_AUTH),
//     }),
// }, {
//     title: 'Basic Auth',
//     description: 'Basic Auth',
// })

// export const UpsertAppConnectionRequestBody = Type.Union([
//     UpsertSecretTextRequest,
//     UpsertOAuth2Request,
//     UpsertCloudOAuth2Request,
//     UpsertPlatformOAuth2Request,
//     UpsertBasicAuthRequest,
//     UpsertCustomAuthRequest,
// ])

export type UpsertAppConnectionInput = UpsertCustomAuthInput | UpsertSecretTextInput
// export interface UpsertAppConnectionInput extends CommonAuthProps {
// 	type: AppConnectionType
// 	value: any
// }

// export type UpsertCloudOAuth2Request = Static<typeof UpsertCloudOAuth2Request>
// export type UpsertPlatformOAuth2Request = Static<typeof UpsertPlatformOAuth2Request>
// export type UpsertOAuth2Request = Static<typeof UpsertOAuth2Request>
// export type UpsertSecretTextRequest = Static<typeof UpsertSecretTextRequest>
// export type UpsertBasicAuthRequest = Static<typeof UpsertBasicAuthRequest>
// export type UpsertCustomAuthRequest = Static<typeof UpsertCustomAuthRequest>
// export type UpsertAppConnectionRequestBody = Static<typeof UpsertAppConnectionRequestBody>