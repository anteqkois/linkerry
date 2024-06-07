import { z } from 'zod'
import { idSchema } from '../../../common/zod'
import { SubscriptionPeriod } from './enums'

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

export enum ChangeSubscriptionResponseType {
  CHECKOUT = 'CHECKOUT',
  UPGRADE = 'UPGRADE',
}
export interface ChangeSubscriptionCheckoutResponse {
  type: ChangeSubscriptionResponseType.CHECKOUT
  checkoutUrl: string
}
export interface ChangeSubscriptionUpgradeResponse {
  type: ChangeSubscriptionResponseType.UPGRADE
}

export type ChangeSubscriptionResponse = ChangeSubscriptionCheckoutResponse | ChangeSubscriptionUpgradeResponse
