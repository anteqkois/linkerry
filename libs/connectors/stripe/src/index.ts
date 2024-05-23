import { createCustomApiCallAction } from '@linkerry/connectors-common'
import { createConnector } from '@linkerry/connectors-framework'
import { stripeCreateCustomer } from './actions/create-customer'
import { stripeCreateInvoice } from './actions/create-invoice'
import { stripeRetrieveCustomer } from './actions/retrieve-customer'
import { stripeSearchCustomer } from './actions/search-customer'
import { stripeAuth } from './common/auth'
import { stripeNewCustomer } from './trigger/new-customer'
import { stripeNewPayment } from './trigger/new-payment'
import { stripeNewSubscription } from './trigger/new-subscription'
import { stripePaymentFailed } from './trigger/payment-failed'

export const stripe = createConnector({
  displayName: 'Stripe',
  description: 'Online payments infrastructure for the internet businesses',
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/stripe.png',
  tags: ['commerce', 'payments'],
  auth: stripeAuth,
  actions: [
    stripeCreateCustomer,
    stripeCreateInvoice,
    stripeSearchCustomer,
    stripeRetrieveCustomer,
    createCustomApiCallAction({
      baseUrl: () => 'https://api.stripe.com/v1',
      auth: stripeAuth,
      authMapping: (auth) => ({
        Authorization: `Bearer ${auth}`,
      }),
    }),
  ],
  triggers: [stripeNewPayment, stripeNewCustomer, stripePaymentFailed, stripeNewSubscription],
})
