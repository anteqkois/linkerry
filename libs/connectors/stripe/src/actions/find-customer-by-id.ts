import { HttpMethod, httpClient } from '@linkerry/connectors-common'
import { Property, createAction } from '@linkerry/connectors-framework'
import { stripeAuth } from '../common/auth'

export const stripeFindCustomerById = createAction({
  name: 'find_customer_by_id',
  auth: stripeAuth,
  displayName: 'Find Customer By ID',
  description: 'Locate a customer in Stripe using their Stripe Customer ID',
  descriptionLong:
    'This feature allows users to find a customer in Stripe by entering their Stripe Customer ID. It provides an efficient way to retrieve detailed customer information, with options to expand tax and subscriptions data if needed.',
  props: {
    id: Property.ShortText({
      displayName: 'Id',
      description: 'The unique ID of the Stripe customer to search for.',
      required: true,
    }),
    expand_tax: Property.Checkbox({
      displayName: 'Expand Customer Tax information',
      description: 'Enable this option to retrieve additional tax information about the customer, like VAT number.',
      required: false,
      defaultValue: true,
    }),
    expand_subscriptions: Property.Checkbox({
      displayName: 'Expand Customer Subscriptions information',
      description: 'Enable this option to retrieve detailed information about the customer’s subscriptions.',
      required: false,
      defaultValue: false,
    }),
  },
  async run({ auth, propsValue }) {
    const expand: string[] = []

    if (propsValue.expand_tax) expand.push('tax_ids')
    if (propsValue.expand_subscriptions) expand.push('subscriptions')

    const data = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://api.stripe.com/v1/customers/${propsValue.id}`,
      queryParams: {
        expand,
      },
      headers: {
        Authorization: 'Bearer ' + auth,
      },
    })

    return data.body
  },
})
