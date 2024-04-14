import { Id } from "@linkerry/shared"

export const REDIS_CLIENT_NAMESPACE = {
	PUBLISHER: 'FLOW_RUN_PUBLISHER',
	SUBSCRIBER: 'FLOW_RUN_SUBSCRIBER',
	SERVER: 'SERVER',
}

export const REDIS_KEYS = {
	AUTH: {
		EMAIL_VERIFICATION_CODE: ({ code, userId }: { code: string, userId: Id }) => `user/${userId}/auth/email-code/${code}`,
		EMAIL_VERIFICATION_CODE_WILDCARD: ({ userId }: {userId: Id }) => `user/${userId}/auth/email-code/*`,
	},
}
