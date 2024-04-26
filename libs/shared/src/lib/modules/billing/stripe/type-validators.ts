import { tags } from 'typia'

export type StripeSubscriptionId = string & tags.Pattern<'^sub_[A-Za-z0-9]+$'>
