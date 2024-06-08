import { HttpMethod, httpClient } from '@linkerry/connectors-common'
import { Property, createAction } from '@linkerry/connectors-framework'
import { stripeAuth } from '../common/auth'

export const stripeCreateInvoice = createAction({
  name: 'create_invoice',
  auth: stripeAuth,
  displayName: 'Create Invoice',
  description: 'Quickly generate and send invoices through Stripe.',
  descriptionLong:
    'Create Invoice allows users to easily generate and send detailed invoices using Stripe. This feature streamlines billing by automating invoice creation with essential details like customer ID, currency, and description. Ideal for businesses and freelancers, it ensures accurate and professional invoicing, saving time and reducing errors. Users can manage their billing processes efficiently, keeping track of payments and maintaining clear records.',
  props: {
    customer_id: Property.ShortText({
      displayName: 'Customer ID',
      description: 'The unique identifier for the customer in Stripe, necessary for billing the correct account.',
      required: true,
    }),
    currency: Property.ShortText({
      displayName: 'Currency',
      description: 'Specifies the currency in which the invoice will be charged, such as USD, EUR, etc.',
      required: true,
    }),
    description: Property.LongText({
      displayName: 'Description',
      description: 'Provides additional details or notes about the invoice, helping to clarify the charges.',
      required: false,
    }),
  },

  async run(context) {
    const invoice = {
      customer: context.propsValue.customer_id,
      currency: context.propsValue.currency,
      description: context.propsValue.description,
    }

    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: 'https://api.stripe.com/v1/invoices',
      headers: {
        Authorization: 'Bearer ' + context.auth,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        customer: invoice.customer,
        currency: invoice.currency,
        description: invoice.description,
      },
    })
    return response.body
  },
})
