import { HttpMethod, httpClient } from '@linkerry/connectors-common'
import { Property, Validators, createAction } from '@linkerry/connectors-framework'
import { stripeAuth } from '../common/auth'

export const stripeFindCustomerByEmail = createAction({
  name: 'find_customer_by_email',
  auth: stripeAuth,
  displayName: 'Find Customer By Email',
  description: 'Locate a customer in Stripe using their email address',
  descriptionLong:
    'This feature allows users to find a customer in Stripe by entering their email address. It is a straightforward way to retrieve customer information quickly and efficiently by just using the associated email.',
  props: {
    email: Property.ShortText({
      displayName: 'Email',
      description: 'The email address of the Stripe customer to search for.',
      required: true,
      validators: [Validators.email],
    }),
  },
  async run({ auth, propsValue }) {
    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://api.stripe.com/v1/customers?email=${propsValue.email}`,
      queryParams: {
        expand: ['tax_ids', 'subscriptions'],
      },
      headers: {
        Authorization: 'Bearer ' + auth,
      },
    })
    return response.body?.['data'][0]
  },
})
