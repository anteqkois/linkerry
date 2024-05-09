import { z } from 'zod'
import { connectorNameSchema, idSchema, stringShortSchema } from '../../../common/zod'
import { AppConnectionType } from '../app-connection'
import { OAuth2AuthorizationMethod } from '../oauth2-authorization-method'

const commonAuthPropsSchema = z.object({
	name: stringShortSchema,
	connectorName: connectorNameSchema,
	projectId: idSchema,
})
type CommonAuthProps = z.infer<typeof commonAuthPropsSchema>

export enum OAuth2GrantType {
	AUTHORIZATION_CODE = 'authorization_code',
	CLIENT_CREDENTIALS = 'client_credentials',
}

export const upsertCustomAuthInputSchema = commonAuthPropsSchema.merge(
	z.object({
		type: z.enum([AppConnectionType.CUSTOM_AUTH]),
		value: z.object({
			type: z.enum([AppConnectionType.CUSTOM_AUTH]),
			props: z.record(z.unknown()),
		}),
	}),
)
export type UpsertCustomAuthInput = z.infer<typeof upsertCustomAuthInputSchema>

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

export const upsertCloudOAuth2RequestSchema = commonAuthPropsSchema.merge(
	z.object({
		type: z.enum([AppConnectionType.CLOUD_OAUTH2]),
		value: z.object({
			client_id: stringShortSchema,
			code: stringShortSchema,
			code_challenge: stringShortSchema.optional(),
			props: z.record(z.string()).optional(),
			scope: stringShortSchema,
			type: z.enum([AppConnectionType.CLOUD_OAUTH2]),
			authorization_method: z.nativeEnum(OAuth2AuthorizationMethod),
			// retrived on the backend
			// token_url?: string
		}),
	}),
)
export type UpsertCloudOAuth2Request = z.infer<typeof upsertCloudOAuth2RequestSchema>

export const upsertSecretTextInputSchema = commonAuthPropsSchema.merge(
	z.object({
		type: z.enum([AppConnectionType.SECRET_TEXT]),
		value: z.object({
			type: z.enum([AppConnectionType.SECRET_TEXT]),
			secret_text: stringShortSchema,
		}),
	}),
)
export type UpsertSecretTextInput = z.infer<typeof upsertSecretTextInputSchema>

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

export const upsertAppConnectionInputSchema = z.union([
	upsertCustomAuthInputSchema.omit({
		projectId: true,
	}),
	upsertSecretTextInputSchema.omit({
		projectId: true,
	}),
	upsertCloudOAuth2RequestSchema.omit({
		projectId: true,
	}),
])
export type UpsertAppConnectionInput = z.infer<typeof upsertAppConnectionInputSchema>

// export interface UpsertAppConnectionInput extends CommonAuthProps {
// 	type: AppConnectionType
// 	value: any
// }
