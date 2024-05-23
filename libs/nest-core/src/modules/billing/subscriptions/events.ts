import { Id, Product, Subscription } from '@linkerry/shared'

export interface SubscriptionUpdate {
  id: Id
  data: Partial<Subscription>
}

export interface SubscriptionPlanUpdate {
  oldSubscription: Subscription
  oldPlan: Product
  newSubscription: Subscription
  newPlan: Product
}
