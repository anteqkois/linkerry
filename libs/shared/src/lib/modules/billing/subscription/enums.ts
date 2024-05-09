export enum SubscriptionPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

/* store status etc data in our db insted only in Stripe to have ability to change paymnet way when user wants to edit incomplete subscription */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  UNAPID = 'unpaid',
}
export enum PaymentGateway {
  NONE = 'NONE',
  STRIPE = 'STRIPE',
}
