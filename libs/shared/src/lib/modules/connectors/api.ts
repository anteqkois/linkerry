import { z } from 'zod'
import { paginationQuerySchema } from '../../common'
import { connectorNameSchema, idSchema, stepNameSchema, stringShortSchema, versionSchema } from '../../common/zod'
import { ConnectorType, PackageType } from './connector'

export const connectorsMetadataGetManyQuerySchema = paginationQuerySchema.merge(
	z.object({
		displayName: stringShortSchema.optional(),
		summary: z.boolean().optional(),
	}),
)
export interface ConnectorsMetadataGetManyQuery extends z.infer<typeof connectorsMetadataGetManyQuerySchema> {}

export const connectorsMetadataGetOneQuerySchema = z.object({
	summary: z.boolean().default(true).optional(),
	version: versionSchema.optional(),
})
export interface ConnectorsMetadataGetOneQuery extends z.infer<typeof connectorsMetadataGetOneQuerySchema> {}

export const connectorsGetOptionsInputSchema = z.object({
	packageType: z.nativeEnum(PackageType),
	connectorType: z.nativeEnum(ConnectorType),
	connectorVersion: versionSchema,
	connectorName: connectorNameSchema,
	propertyName: stringShortSchema,
	stepName: stepNameSchema,
	flowId: idSchema,
	flowVersionId: idSchema,
	input: z.any(),
	searchValue: stringShortSchema.optional(),
})
export interface ConnectorsGetOptionsInput extends z.infer<typeof connectorsGetOptionsInputSchema> {}

export interface ConnectorsGetOptionsResponse {
	options: { label: string; value: string }[]
	disabled?: boolean
	placeholder?: string
}
