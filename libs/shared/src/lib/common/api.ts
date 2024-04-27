import { z } from 'zod'

export const paginationQuerySchema = z.object({
	offset: z.number().optional(),
	limit: z.number().optional(),
})
export interface PaginationQuery extends z.infer<typeof paginationQuerySchema> {}

export interface IPaginationResponse {
	offset?: number
}

export interface IResourceResponse<R> {
	hasNext: boolean
	value: R
	offset: number
}
