import { z } from 'zod'
import { idSchema } from '../../../common/zod'
import { SubscriptionPeriod } from './subscription'

export const changeSubscriptionBodySchema = z.object({
	items: z.array(
		z.object({
			productId: idSchema,
			priceId: idSchema,
		}),
	),
	period: z.nativeEnum(SubscriptionPeriod),
})
export type ChangeSubscriptionBody = z.infer<typeof changeSubscriptionBodySchema>
export interface ChangeSubscriptionResponse {
	checkoutUrl: string
}
