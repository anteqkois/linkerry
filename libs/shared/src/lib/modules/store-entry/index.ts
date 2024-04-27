import { z } from 'zod'
import { BaseDatabaseFields } from '../../common'
import { idSchema, stringShortSchema } from '../../common/zod'

export const storeEntrySchema = z.object({
	key: stringShortSchema,
	projectId: idSchema,
	value: z.unknown(),
})
export interface StoreEntry extends BaseDatabaseFields, z.infer<typeof storeEntrySchema> {}

export const putStoreEntryRequestSchema = z.object({
	key: stringShortSchema,
	value: z.any(),
})
export type PutStoreEntryRequest = z.infer<typeof putStoreEntryRequestSchema>

export const getStoreEntryRequestSchema = z.object({
	key: stringShortSchema,
})
export type GetStoreEntryRequest = z.infer<typeof getStoreEntryRequestSchema>

export const deletStoreEntryRequestSchema = z.object({
	key: stringShortSchema,
})
export type DeletStoreEntryRequest = z.infer<typeof deletStoreEntryRequestSchema>
