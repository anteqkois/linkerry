import { z } from 'zod'

export type Id = string // Id to db docuemnt

export const idStringSchema = z.string().regex(/^[0-9a-f]{24}$/)

export interface DatabaseTimestamp {
	createdAt: string
	updatedAt: string
}

export type DatabaseTimestampKeys = keyof DatabaseTimestamp
export type DatabseModelInput<M> = Omit<M, '_id' | DatabaseTimestampKeys>
