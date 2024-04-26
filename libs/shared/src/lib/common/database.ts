import { tags } from 'typia';
import { z } from 'zod';

// export type Id = string &  tags. 24 // Id to db docuemnt
export type Id = string & tags.Pattern<"^[0-9a-f]{24}$">; // Id to db docuemnt

export const idStringSchema = z.string().regex(/^[0-9a-f]{24}$/)

export interface DatabaseTimestamp {
	createdAt: string
	updatedAt: string
}

export type DatabaseTimestampKeys = keyof DatabaseTimestamp
export type DatabseModelInput<M> = Omit<M, '_id' | DatabaseTimestampKeys>
