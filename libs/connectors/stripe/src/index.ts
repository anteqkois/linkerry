import { createCustomApiCallAction } from '@linkerry/connectors-common'
import { createConnector } from '@linkerry/connectors-framework'
import { stripeCreateCustomer } from './actions/create-customer'
import { stripeCreateInvoice } from './actions/create-invoice'
import { stripeFindCustomerByEmail } from './actions/find-customer-by-email'
import { stripeFindCustomerById } from './actions/find-customer-by-id'
import { stripeAuth } from './common/auth'
import { stripeNewCustomer } from './trigger/new-customer'
import { stripeNewPayment } from './trigger/new-payment'
import { stripeNewSubscription } from './trigger/new-subscription'
import { stripePaymentFailed } from './trigger/payment-failed'

export const stripe = createConnector({
  displayName: 'Stripe',
  description: 'Simplifies online payments infrastructure for the internet businesses and automates financial workflows',
  descriptionLong:
    "Stripe is a powerful payment processing app that enables businesses to accept online payments securely and efficiently. Users can manage subscriptions, automate invoicing, and integrate with various accounting tools to streamline financial operations. Stripe's extensive API allows for custom integrations, making it easy to tailor automation to specific business needs. With advanced fraud prevention and real-time reporting, Stripe helps businesses save time on repetitive tasks and focus on growth. This app is ideal for enhancing payment infrastructure and improving overall financial efficiency.",
  minimumSupportedRelease: '0.0.0',
  logoUrl: '/images/connectors/stripe.png',
  tags: ['commerce', 'payments'],
  auth: stripeAuth,
  actions: [
    stripeCreateCustomer,
    stripeCreateInvoice,
    stripeFindCustomerById,
    stripeFindCustomerByEmail,
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
