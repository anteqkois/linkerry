import { z } from 'zod'
import { EncryptedObject } from '../../../common'
import { stringShortSchema } from '../../../common/zod'

export const oAuth2AppInputSchema = z.object({
	clientId: stringShortSchema,
	clientSecret: stringShortSchema,
	connectorName: stringShortSchema,
})
export type OAuth2AppInput = z.infer<typeof oAuth2AppInputSchema>

export interface OAuth2AppDecrypted {
	clientId: string
	clientSecret: string
	connectorName: string
}

export interface OAuth2AppEncrypted {
	clientId: string
	clientSecret: EncryptedObject
	connectorName: string
}

export interface OAuth2RedirectQuery {
	state: string
	code: string
	scope: string
}
